import React, {  useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, SafeAreaView, Platform } from 'react-native';

import { AppLoading } from 'expo';
import fetchFonts from '../ibm-fonts';

import {NaviconIcon} from '../tab-icons';

const PageLayout = props => {
    const [fontLoaded, setFontLoaded] = useState(false);

    if(!fontLoaded) {
        return (
            <AppLoading
            startAsync={fetchFonts}
            onFinish={() => setFontLoaded(true)}
            />
        );
    };
    if(props.isImage){
        return (
            <SafeAreaView style={{backgroundColor: '#F1F0EE', flex: 1}}>
                <View style={styles.screen}>
                    <StatusBar barStyle='dark-content' />
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.navicon} onPress={() => props.nav.openDrawer()}>
                            <NaviconIcon />
                        </TouchableOpacity>
                        <View style={styles.headerZone}>
                            <Text style={styles.headerStyle}>{props.header}</Text>
                        </View>
                        <View style={styles.imageZone}>
                            <Image 
                                style={styles.imageStyle}
                                source={props.imageSource}
                            />
                        </View>
                    </View>
                    <View style={styles.body}>
                        {props.children}
                    </View>
                </View>
            </SafeAreaView>
            
        );
        } else {
            return (
                <View style={styles.screen}>
                <View style={styles.headerContainer}>
                    <View style={styles.naviconWithoutImage}>
                        <TouchableOpacity onPress={() => props.nav.openDrawer()}>
                            <NaviconIcon />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerZoneWithoutImage}>
                        <Text style={styles.headerStyle}>{props.header}</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    {props.children}
                </View>
            </View>                
            )
        }
};

const styles = StyleSheet.create({
    screen: {
        height: '100%',
        width: '100%',
        backgroundColor: '#FFFFFF'
    },
    body: {
        height: Platform.OS === 'ios' ? '93%' : '89%'
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F0EE',
        paddingTop: Platform.OS === 'ios' ? 10 : 25,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'space-around',
        height: Platform.OS === 'ios' ? '7%' : '11%',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.3,
        elevation: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    headerStyle: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 19,
        color: '#323232',
        alignItems: 'center',
        justifyContent: 'center'
    },
    navicon: {
        width: '15%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    naviconWithoutImage: {
        flex: 1
    },
    headerZone: {
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    headerZoneWithoutImage: {
        flex: 3
    },
    imageZone: {
        width: '15%',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    imageStyle: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain'
    },
});

export default PageLayout;