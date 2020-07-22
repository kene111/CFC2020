import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

import PageLayout from '../components/page-layout';
import LoadingPage from '../components/loading-page';
import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';


const makeRequest = async (getMessage) => {
    let data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: getMessage
        })
    }
    
    try {
        let response = await fetch('https://ndia-api-boisterous-duiker-ts.eu-gb.mybluemix.net/chatbot', data);
        let responseJson = response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

const CustomBubble = props => {
    return (
        <Bubble 
            {...props}
            textStyle={{
                right: styles.rightMessageStyle,
                left: styles.leftMessageStyle
            }}
        />
    )
} 


const sChat = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);

    const getInitialMessage = async () => {
        let response = await makeRequest("")
        const responseMessage = [{
            _id: Math.round(Math.random() * 1000000000),
            text: response.output.generic[0].text,
            createdAt: new Date().getTime(),
            user: {
                _id: 2,
                name: 'Watson Assistant'
            }
        }];
        
        setMessages(
            previousMessages => GiftedChat.append(previousMessages, responseMessage)
        );
        setIsLoading(false);

    }

    const getMessage = async (message) => {
        let response = await makeRequest(message)
        const responseMessage = [{
            _id: Math.round(Math.random() * 1000000000),
            text: response.output.generic[0].text,
            createdAt: new Date().getTime(),
            user: {
                _id: 2,
                name: 'Watson Assistant'
            }
        }];
        
        setMessages(
            previousMessages => GiftedChat.append(previousMessages, responseMessage)
        );
        setIsTyping(false);

    }

    const handleSend = (newMessage=[]) => {
        setMessages(
            previousMessages => GiftedChat.append(previousMessages, newMessage)
        );
        setIsTyping(true);
        getMessage(newMessage[0].text);

    }

    useEffect(() => {
        getInitialMessage();
    }, []);

    if(!fontLoaded) {
        return (
            <AppLoading
            startAsync={fetchFonts}
            onFinish={() => setFontLoaded(true)}
            />
        );
    };

    return (
        <PageLayout 
            header='Ask a Question!'
            isImage={true}
            imageSource= {require('../images/ibm-watson-logo.png')}
            nav={navigation}
        >
            {isLoading ? 
                <LoadingPage
                    image={require('../images/ibm-watson-logo.png')}
                    loadingText='Loading Chatbot'
                /> : (
                    <View style={{flex: 1}}>
                        <GiftedChat
                        bottomOffset={isIphoneX() ? getBottomSpace() : 0}
                        isTyping={isTyping}
                        renderBubble={props => CustomBubble(props)}
                        messages={messages}
                        onSend={newMessage => handleSend(newMessage)}
                        user={{ _id: 1 }}
                        />
                    </View>
            )}
        </PageLayout>
    )
}

const styles = StyleSheet.create({
    leftMessageStyle: {
        color: 'black',
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 16,
        fontWeight: '500'
    },
    rightMessageStyle: {
        color: 'white',
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 16,
        fontWeight: '500'
    }
})

export default sChat;