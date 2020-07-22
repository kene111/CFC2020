import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { AppLoading } from 'expo';
import fetchFonts from '../ibm-fonts';

const HospitalComponent = props => {
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
        <TouchableOpacity onPress={props.onPressHospital}>
            <View style={styles.outerContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.nameStyle}>{props.name}</Text>
                    <Text style={styles.vicinityStyle}>{props.vicinity}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    innerContainer: {
        padding: 10
    },
    nameStyle: {
        fontSize: 17,
        fontFamily: 'IBMPlexSans-Medium'
    },
    vicinityStyle: {
        fontSize: 13,
        fontFamily: 'IBMPlexSans-Light'
    }
});

export default HospitalComponent;