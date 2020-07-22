import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';

const NewsHeadline = props => {
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
            <View style={styles.headlineContainer}>
                <Text style={styles.headlineStyle}>{props.headline}</Text>
                <View styles={styles.buttonGorup}>
                    <TouchableOpacity onPress={() => Linking.openURL(props.link)}>
                        <Text style={styles.button}>Read More...</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{props.country} {props.time} {props.day}</Text>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#c0c0c0',
        borderBottomWidth: 1
    },
    headlineContainer: {
        padding: 15
    },
    headlineStyle: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    linkStyle: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 12,
        color: '#1062FE',
        fontWeight: '500'
    },
    footer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    footerText: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 10,
        color: '#323232',
        fontStyle: 'italic',
        fontWeight: '400'
    },
    buttonGroup: {
        flex: 1,
        width: 175
    },
    button: {
        backgroundColor: '#FFFFFF',
        color: '#1062FE',
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 14,
        overflow: 'hidden',
        padding: 10,
        textAlign: 'center',
        marginTop: 5
    },
});

export default NewsHeadline;