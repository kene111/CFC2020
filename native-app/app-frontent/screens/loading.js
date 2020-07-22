import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';

const Loading = props => {
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
        <Image style={styles.image}
            source={require('../images/logo-512.png')}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    image: {
        height: '50%',
        width: '50%',
        resizeMode: 'center'
    },
    title: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 18,
        color: '#323232'
    }
});

export default Loading;