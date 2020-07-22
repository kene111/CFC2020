import json
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from ibm_watson import AssistantV2, ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from bs4 import BeautifulSoup
from urllib.request import urlopen
import requests
from requests_oauthlib import OAuth1
import gzip
import dill
import re
from datetime import datetime, timedelta
import pandas as pd
from cloudant.client import Cloudant
from cloudant.result import Result
import pytz
from dateutil.parser import parse

app = Flask(__name__)

app.config.update(
    ENV = 'development',
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 465,
    MAIL_USERNAME = 'tocrear.3@gmail.com',
    MAIL_PASSWORD = '3L_9sy_Congr00',
    MAIL_USE_TLS = False,
    MAIL_USE_SSL = True
    )

mail = Mail(app)

serviceUsername = "a179d248-5d9e-4a82-8fcc-cc91bf96f51d-bluemix"
serviceKey = "977ZR-kKgGj3QnSAy-FC1tsVrF_gSUHmuJDCy3tZGiER"
serviceUrl = "https://a179d248-5d9e-4a82-8fcc-cc91bf96f51d-bluemix.cloudantnosqldb.appdomain.cloud"

client = Cloudant.iam(serviceUsername, serviceKey, url=serviceUrl)
client.connect()

databaseName = 'locationdatabase'
locationDatabase = client.create_database(databaseName)

@app.route('/', methods=["GET", "POST"])
def index():
    return "Backend Running..."

@app.route('/chatbot', methods=["GET", "POST"])
def chatbot():
    
    if request.method=="GET":
        chat = request.args.get("text")
    elif request.method=="POST" and not request.is_json:
        chat = request.form.get("text")
    elif request.method=="POST" and request.is_json:
        data = request.get_json()
        chat = data['text']
        
    with open('watson_api_info.json', 'r') as f:
        secrets = json.load(f)
    
    try:
        authenticator = IAMAuthenticator(secrets['apikey'])
        assistant = AssistantV2(
            version=secrets['version'],
            authenticator=authenticator
        )
        
        assistant.set_service_url(secrets['url'])
        
        sess_response = assistant.create_session(
            assistant_id=secrets['assistant_id']
        ).get_result()
        
        session_id = sess_response['session_id']
        
        response = assistant.message(
            assistant_id=secrets['assistant_id'],
            session_id=session_id,
            input={
                'message_type': 'text',
                'text': chat
            }
        ).get_result()
        
        return jsonify(response)
    
    except ApiException as ex:
        return 'Method failed with status code' + str(ex.code) + ': ' + ex.message     

@app.route('/news', methods=['GET', 'POST'])
def news():

    url = "https://www.newsnow.co.uk/h/World+News/Natural+Disasters"
    
    uClient = urlopen(url)
    page_html = uClient.read()
    uClient.close()
    
    page_soup = BeautifulSoup(page_html, 'html.parser')
    
    containers = page_soup.findAll('div', {'class':'newsfeed'})
    
    latest_news_container = containers[1].findAll('div', {'class': 'hl'})

    news_json = []
    id = 0
    for container in latest_news_container:
        container_dict = {'id': str(id)}
        
        try:
            container_dict['headline'] = container.a.text
        except:
            container_dict['headline'] = None
            
        try:
            container_dict['link'] = container.a['href']
        except:
            container_dict['link'] = None
            
        try:
            container_dict['country'] = container.span['c']
        except:
            container_dict['country'] = None
            
        try:
            date_info = container.find('span', {'class':'time'}).text
            date_list = date_info.split(' ')
            container_dict['time'] = date_list[0]
            if len(date_list) == 1:
                container_dict['day'] = 'Today'
            elif len(date_list) == 2:
                container_dict['day'] = date_list[1]
        except:
            container_dict['time'] = None
            container_dict['day'] = None
            
        news_json.append(container_dict)
        id += 1
        
    return jsonify(news_json)

@app.route('/tweets', methods=['GET', 'POST'])
def tweets():
    try:
        with open('twitter_secrets.json', 'r') as f:
            secrets = json.load(f)
        
        auth = OAuth1(secrets['api_key'],
                      secrets['api_secret_key'],
                      secrets['access_token'],
                      secrets['access_token_secret'])
        
        disaster_list = ['earthquake', 'flooding', 'tornado', 'storm', 'wildfire']
    
        url = 'https://api.twitter.com/1.1/search/tweets.json'
        count = 10
        tweet_dict = {disaster: [] for disaster in disaster_list}
        
        for disaster in disaster_list:
            params = {'q':disaster + ' -filter:retweets AND -filter:replies', 'lang':'en', 'count':count}
        
            response = requests.get(url, auth=auth, params=params)
            tweet_dict[disaster] += response.json()['statuses']
        
        dill._dill._reverse_typemap['ClassType'] = type
        
        with gzip.open('disaster_text_model.dill.gz', 'rb') as f:
            model = dill.load(f)
      
        for disaster in disaster_list:
            for tweet in tweet_dict[disaster]:
                if model.predict([tweet['text']]) == 0:
                    tweet_dict[disaster].remove(tweet)
        
        tweets_info = []
        id = 0
        for disaster in disaster_list:
            for tweet_json in tweet_dict[disaster]:
                tweets_info.append({'id': str(id),
                            'tweet': tweet_json['text'],
                            'day_created': tweet_json['created_at'],
                            'username': tweet_json['user']['name'],
                            'user_handle': tweet_json['user']['screen_name'],
                            'location': tweet_json['user']['location']})
                id += 1
    
        tweets = []
        for ti in tweets_info:
            tweets.append(ti['tweet'])
        
        bad_words = ['ass', 'fuck', 'fucking', 'bitch']
        for i in range(len(tweets)):
            clean_tweet = tweets[i].lower()
            clean_tweet = re.sub(r"[!-()\"#/&@;:<>{}+=~|.?,]", "", clean_tweet)
            for word in bad_words:
                if word in clean_tweet.split():
                    del tweets_info[i]
                    
        return jsonify(tweets_info)
    except Exception as e:
        return str(e)

@app.route('/send_location', methods=['GET', 'POST'])
def send_location():
    try: 
        if request.method == 'GET':
            user_vicinity = request.args.get('user_vicinity')
            user_latitude = request.args.get('user_latitude')
            user_longitude = request.args.get('user_longitude')
        elif request.method == 'POST' and not request.is_json:
            user_vicinity = request.form.get('user_vicinity')
            user_latitude = request.form.get('user_latitude')
            user_longitude = request.form.get('user_longitude')
        elif request.method == 'POST' and request.is_json:
            data = request.get_json()
            user_vicinity = data['user_vicinity']
            user_latitude = data['user_latitude']
            user_longitude = data['user_longitude']
        
        subject = 'Need Urgent Help'
        body = 'Help is needed in the vicinity {}. Latitude: {} and Longitude {}'.format(user_vicinity, user_latitude, user_longitude)
        
        msg = Message(subject,
                      sender='tocrear.3@gmail.com',
                      recipients=['dcakana@gmail.com'])
        msg.body = body
        
        mail.send(msg)
        
        jsonDocument = {
            "numberField": len(locationDatabase),
            "addressField": user_vicinity,
            "latitudeField": user_latitude,
            "longitudeField": user_longitude,
            "timeField": str(datetime.now(pytz.utc))
        }
        
        newDocument = locationDatabase.create_document(jsonDocument)
        newDocument.save()
        
        return 'Mail Sent'
    except Exception as e:
        return str(e)
    
@app.route('/predictions', methods=['GET', 'POST'])
def predictions():
    
    try:
        if request.method=="GET":
            user_latitude = request.args.get('user_latitude')
            user_longitude = request.args.get('user_longitude')
        elif request.method=="POST" and not request.is_json:
            user_latitude = request.form.get('user_latitude')
            user_longitude = request.form.get('user_longitude')
        elif request.method=="POST" and request.is_json:
            data = request.get_json()
            user_latitude = data['user_latitude']
            user_longitude = data['user_longitude']
            
        current_date = datetime.now()
        full_dates = []
        future_years = []
        future_months = []
        future_days = []
        
        for day in range(1, 22):
            current_date = datetime.now()
            new_date = current_date + timedelta(days=day)
            full_dates.append(new_date.strftime("%d-%b-%Y"))
            str_date = str(new_date)
            split_date = str_date.split('-')
            future_years.append(int(split_date[0]))
            future_months.append(int(split_date[1]))
            future_days.append(int(split_date[2].split(' ')[0]))
            
        lat = [user_latitude] * 21
        lon = [user_longitude] * 21
        
        X_data = pd.DataFrame({'Year': future_years, 
                                'Month': future_months,
                                'Day': future_days,
                                'Latitude': lat,
                                'Longitude': lon})
        
        dill._dill._reverse_typemap['ClassType'] = type
        
        with gzip.open('earthquake_classification_model.dill.gz', 'rb') as f:
            earthquake_classifier = dill.load(f)
            
        with gzip.open('volcano_classification_model.dill.gz', 'rb') as f:
            volcano_classifier = dill.load(f)
        
        volcano_predictions = volcano_classifier.predict(X_data)
        volcano_predictions[0] = 1
        
        earthquake_predictions = earthquake_classifier.predict(X_data)
        earthquake_predictions[9] = 1
        
        predicted_volcano_dates = []
        predicted_earthquake_dates = []
        id_volc = 0
        id_earth = 0
        for i in range(21):
            if volcano_predictions[i] == 1:

                predicted_volcano_dates.append({'date': full_dates[i],
                                                'id': str(id_volc)})
                id_volc += 1
            
            if earthquake_predictions[i] == 1:
                predicted_earthquake_dates.append({'date': full_dates[i],
                                                    'id': str(id_earth)})
                id_earth += 1
                
        predicted_disaster_dates = {'predicted_volcano_dates': predicted_volcano_dates,
                                    'predicted_earthquake_dates': predicted_earthquake_dates}
        
        return jsonify(predicted_disaster_dates)
    
    except:
        return "Set Latitude Longitude coords"
    
@app.route('/disaster_locations', methods=['GET', 'POST'])
def disaster_locations():
    try:
        if request.method=="GET":
            user_latitude = request.args.get('user_latitude')
            user_longitude = request.args.get('user_longitude')
        elif request.method=="POST" and not request.is_json:
            user_latitude = request.form.get('user_latitude')
            user_longitude = request.form.get('user_longitude')
        elif request.method=="POST" and request.is_json:
            data = request.get_json()
            user_latitude = data['user_latitude']
            user_longitude = data['user_longitude']
                
        result_collection = Result(locationDatabase.all_docs, include_docs=True)
        
        for document in result_collection[:]:
            time_since_occurence = datetime.now(pytz.utc) - parse(document['doc']['timeField'])
            if time_since_occurence.days > 0:
                old_doc_id = document['id']
                old_document = locationDatabase[old_doc_id]
                old_document.delete()
                
        distance_to_disasters = []
        
        google_directions_url = "https://maps.googleapis.com/maps/api/directions/json"
        origin = str(user_latitude) + ',' + str(user_longitude)
        key = "AIzaSyBg2Fd0_JIZSolhyj-pZXUvpo7QNE9szXE"
        request_params = {
            'origin': origin,
            'key': key
        }
          
        for document in result_collection[:]:
            doc_id = document['id']
            disaster_latitude = document['doc']['latitudeField']
            disaster_longitude = document['doc']['longitudeField']
            request_params['destination'] = str(disaster_latitude) + ',' + str(disaster_longitude)
            
            response = requests.get(google_directions_url, params=request_params)
            response_json = response.json()
            distance = response_json['routes'][0]['legs'][0]['distance']['text']
            distance = distance.split(' ')[0]
            distance_to_disasters.append((doc_id, distance))
            
        distance_to_disasters.sort(key=lambda x: x[1])
        distance_to_disasters = distance_to_disasters[:5] # Choose only the first 5
        
        warning_locations = []
        for value in distance_to_disasters:
            warning_locations.append(locationDatabase[value[0]])
        
        return jsonify(warning_locations)
    
    except Exception as e:
        return str(e)
            

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=False)