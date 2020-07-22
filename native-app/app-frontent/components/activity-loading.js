import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { AppLoading } from 'expo';
import fetchFonts from '../ibm-fonts';

const ActivityLoading = props => {
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
        <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.loadingText}>{props.title}</Text>
            </View>
            <ActivityIndicator /> 
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    innerContainer: {
        marginBottom: 5
    },
    loadingText: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 15,
        color: '#c0c0c0'
    }
});

export default ActivityLoading;