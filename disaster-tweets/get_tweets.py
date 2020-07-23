# Was too lazy to do the virtualenv thing so you best be making sure you've installed all these guys before running anything.
import json
import requests
from requests_oauthlib import OAuth1
import gzip
import dill
import re

# Loading Twitter API secrets....
with open('twitter_search_api/twitter_secrets.json', 'r') as f:
    secrets = json.load(f)

auth = OAuth1(secrets['api_key'],
              secrets['api_secret_key'],
              secrets['access_token'],
              secrets['access_token_secret'])

# These were the major disasters I could think of that needed searching. You can add or remove any depending.
disaster_list = ['earthquake', 'flooding', 'tornado', 'storm', 'wildfire']

# To remove and complications and redundancies, I filtered out retweets and replies from the the responses.
# The "tweet_dict" dictionary has all the natural disasters from the "disaster_list" as it's keys, and each
# key stores the response for that particular disaster from the api.
# The "count" variable is the maximum number of tweets we're requesting from the api for each disaster. I chose
# 10, you can change it dependiing.

url = 'https://api.twitter.com/1.1/search/tweets.json'
count = 10
tweet_dict = {disaster: [] for disaster in disaster_list}

for disaster in disaster_list:
    params = {'q':disaster + ' -filter:retweets AND -filter:replies', 'lang':'en', 'count':count}

    response = requests.get(url, auth=auth, params=params)
    tweet_dict[disaster] += response.json()['statuses']

dill._dill._reverse_typemap['ClassType'] = type # Had to add this to stop a strange error from modern dill packages

# Loading the Disaster Tweets model....
with gzip.open('ml_model/disaster_text_model.dill.gz', 'rb') as f:
    model = dill.load(f)

# Running predictions on the model for all the tweets gotten from the api. If the model doesn't feel a tweet is
# of the "disaster" nature (and they're a few of them), it deletes the response from the "tweet_dict" dictionary.
# The model doesn't do a bad job per se, but a lot of room for improvement. Still just a baseline model for now
# as I said.
for disaster in disaster_list:
    for tweet in tweet_dict[disaster]:
        if model.predict([tweet['text']]) == 0:
            tweet_dict[disaster].remove(tweet)

# So the responses from the api have a lot of variables, many unwanted ones too. The most important ones I extracted
# from the response were the tweet itself, the day it was created, the username, user handle and location of the person
# making the tweet.
# Should note that this is Twitter, so not all info is valid, especially the location of the people making the tweets.
# Some locations may have "the moon", "my house" or stuff like that. Just added location in case any of the responses
# actually had a tweet from someone around where the app user was or lived.
# I saved all these in a json-esque way in the "tweets_info" list.

tweets_info = []

for disaster in disaster_list:
    for tweet_json in tweet_dict[disaster]:
        tweets_info.append({'tweet': tweet_json['text'],
                    'day_created': tweet_json['created_at'],
                    'username': tweet_json['user']['name'],
                    'user_handle': tweet_json['user']['screen_name'],
                    'location': tweet_json['user']['location']})

# I still need to do some cleaning on it. We don't want tweets popping up on our app that have bad words.
# So I picked a few popular bad words and saved them in the "bad_words" list. You can also add or subtract from it
# if you like.
# So all I'm doing is just storing all the tweets first in the "tweets" list, then scanning for any bad words. If a
# bad word is found, the tweet will be chopped off the "tweets_info" list.
# This was the best method since any other thing I thought of higher than some annoying O(n^2)-type complexity.
# It consumes more space but I think it's worth it.
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

# So yeah, now that's done the main thing you'll need is in the "tweets_info" list