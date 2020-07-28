import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';

import { PhoneIcon } from '../tab-icons';

import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ContactComponent = props => {
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
            <View style={styles.imageZone}>
                <Image 
                    style={styles.image}
                    source={props.imageSource}
                />
            </View>
            <View style={styles.description}>
                <Text style={styles.nameStyle}>{props.contactName}</Text> 
            </View>
            <View style={styles.iconOuterContainer}>
                <TouchableOpacity 
                    style={styles.iconInnerContainer}
                    onPress={() => {Linking.openURL(`tel:${props.phoneNumber}`)}}
                >
                    <PhoneIcon />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: windowWidth - 30,
        height: Math.floor(windowHeight * 0.25),
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.4,
        elevation: 5,
        borderRadius: 10,
        marginTop: 5
    },
    imageZone: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    description: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    nameStyle: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 17,
        textAlign: 'center'
    },
    iconOuterContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconInnerContainer: {
        padding: 15,
        borderColor: 'white',
        backgroundColor: 'white',
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        elevation: 5,
        borderRadius: 50
    }

});

export default ContactComponent;