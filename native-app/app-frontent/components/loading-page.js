import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';

const LoadingPage = props => {
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
        <View style={styles.center}>
        <Image style={styles.imageStyle}
            source={props.image}
        />
        <Text style={styles.title}>{props.loadingText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        height: '50%',
        width: '50%',
        resizeMode: 'center'
    },
    title: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 18,
        color: '#323232',
        textAlign: 'center'
    }
});

export default LoadingPage;