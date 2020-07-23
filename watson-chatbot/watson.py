# -*- coding: utf-8 -*-
"""
Created on Wed Apr 15 14:06:58 2020

@author: User
"""

from ibm_watson import AssistantV2, ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

url = "https://api.us-south.assistant.watson.cloud.ibm.com/instances/20239426-5819-42dd-bc01-dd554723cf48"
secrets = {'apikey': "K90djeWzPRymWjgu2l4u1iTSmLbVQeIe92k07cNqb8QD",
           'version': '2020-04-09',
           'assistant_id': 'aa18afa4-01c7-45e4-8895-8920d05d706e'}
chat = 'How do I escape a flood'

try:
    authenticator = IAMAuthenticator(secrets['apikey'])
    assistant = AssistantV2(
        version=secrets['version'],
        authenticator=authenticator
    )
    
    assistant.set_service_url(url)
    
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
    
    print(response['output']['generic'][0]['text'])
    
    sess_end_response = assistant.delete_session(
    assistant_id=secrets['assistant_id'],
    session_id=session_id
    ).get_result()

except ApiException as ex:
    print('Method failed with status code' + str(ex.code) + ': ' + ex.message)
    