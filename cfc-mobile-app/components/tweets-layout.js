import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, Button } from 'react-native';

import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';

const TweetsLayout = props => {
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
        <View style={styles.container}>
            <View style={styles.tweetContainer}>
                <View style={styles.header}>
                    <Text style={styles.nameText}>{props.username}</Text>
                    <Text style={styles.handleText}>   @{props.userHandle}</Text>
                </View>
                <View>
                    <Text style={styles.tweetStyle}>{props.tweet}</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}> {props.date}</Text>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottomColor: '#c0c0c0',
        borderBottomWidth: 1
    },
    tweetContainer: {
        padding: 10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'stretch'
    },
    nameText: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 13,
        color: '#323232',
        fontWeight: 'bold',
    },
    handleText: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 10,
        color: '#323232',
        fontStyle: 'italic',
    },
    tweetStyle: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 15,
        fontWeight: 'bold'
    },
    footer: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingTop: 5
        
    },
    footerText: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 10,
        color: '#323232',
        fontStyle: 'italic',
        fontWeight: '400'
    }
});

export default TweetsLayout;