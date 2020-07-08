# -*- coding: utf-8 -*-
"""
Created on Wed Apr 15 23:24:11 2020

@author: User
"""

import json
from flask import Flask, request, render_template
from ibm_watson import AssistantV2, ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

app = Flask(__name__)
app.config['ENV'] = 'development'

@app.route('/', methods=["GET"])
def main():
    return render_template("chatbot_index.htm")


@app.route('/chatbot', methods=["GET", "POST"])
def chatbot():
    
    if request.method=="GET":
        chat = request.args.get("text")
    else:
        chat = request.form["text"]
        
    with open('watson_chatbot/watson_api_info.json', 'r') as f:
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
        
        return response
    
    except ApiException as ex:
        return 'Method failed with status code' + str(ex.code) + ': ' + ex.message     


if __name__ == "__main__":
    app.run(debug=False)