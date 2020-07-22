import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

import PageLayout from '../components/page-layout';

import { GitHubIcon } from '../tab-icons';

import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';

const HyperLink = props => (
    <Text>
        {' '}<Text 
            style={styles.hyperlinkStyle}
            onPress={() => Linking.openURL(props.link)}
            >
            {props.text}
        </Text>{' '}
    </Text>
)

const About = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);

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
            header='About'
            isImage={true}
            imageSource= {require('../images/logo-512.png')}
            nav={navigation}
        >
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.aboutText}>
                    N.D.I.A (Natural Disaster Informant and Assistant) is an open-source project created with the intention
                    of mitigating the effects of Natural Disasters that occur all around the globe. The major aims of the
                    N.D.I.A project are;
                    {'\n\n\u2022'} Educating users on the risks and safety protocols associated with Natural Disasters
                    {'\n\n\u2022'} Feeding users with news on Natural Disasters occuring around the globe as they happen
                    {'\n\n\u2022'} Applying Artificial Intelligence to warn users of possible Disasters that could surface
                    {'\n\n\u2022'} Feeding users with news on Natural Disasters occuring around the globe as they happen
                    {'\n\n\u2022'} Ensuring there is quick response to people in the midst of a natural disaster and ease of communication
                    {'\n\n'}The project consists of various attributes to aid in actualizing these objectives. Information as
                    we know is priceless in this modern age, and we are helping to ensure the user is kept up to date with natural
                    disasters occuring within the user's region and even all around the globe. This is done using the
                    <HyperLink text='newsnow.co.uk' link='https://www.newsnow.co.uk' />platform, which provides natural disaster news from various news outlets all over the world. The user can also
                    get relevant information on natural disasters by conversing the the chatbot while getting predictions on the
                    likelihood of a disaster occuring around the vicinity. Finally incase of a disaster the user can get directions
                    (including distance and time values) to any destination of choice and be able to locate the nearest hospitals.
                    The project also allows seemless communication between the user and help through emails or phone calls, where
                    the user can pass across information on location and the severity of the predicament.
                    {'\n\n'} The project was created as a result of the <HyperLink text='2020 IBM Call For Code Competition' link='https://www.callforcode.org' /> which urged for the use
                    of technology in climate change to help halt and even reverse its effect on the world.
                    {'\n\n'} You can visit the project website<HyperLink text='here.' link='https://www.google.com' />
                </Text>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <GitHubIcon />
                    <View style={{marginLeft: 10}}>
                        <HyperLink text='View GitHub repository' link='https://www.github.com' />
                    </View>
                </View>
            </ScrollView>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        padding: 20,    
    },
    aboutText: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 15,
        textAlign: 'justify'
    },
    hyperlinkStyle: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 15,
        color: '#1062FE',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        textDecorationColor: '#1062FE'
    }
});

export default About;