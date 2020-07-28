import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';

import PageLayout from '../components/page-layout';
import ActivityLoading from '../components/activity-loading';

import * as Location from 'expo-location';

import { AppLoading } from 'expo';

import fetchFonts from '../ibm-fonts';

const getPredictions = async (latitude, longitude) => {
    let data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_latitude: latitude,
            user_longitude: longitude
        })
    }
    
    try {
        let response = await fetch('https://ndia-api-boisterous-duiker-ts.eu-gb.mybluemix.net/predictions', data);
        let responseJson = response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

const Predictions = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [volcanoDates, setVolcanoDates] = useState(null);
    const [earthquakeDates, setEarthquakeDates] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status != 'granted') {
                setErrorMsg('Permission to access location was denied. Please go to settings and enable location for the application');
            }
            let myLocation = await Location.getCurrentPositionAsync({});
            let predictedDisasterDates = await getPredictions(myLocation.coords.latitude, myLocation.coords.longitude);
            setVolcanoDates(predictedDisasterDates.predicted_volcano_dates);
            setEarthquakeDates(predictedDisasterDates.predicted_earthquake_dates);
        })();

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
            header='Disaster Predictions'
            isImage={true}
            imageSource={require('../images/prediction-image.jpg')}
            nav={navigation}    
        >
            <View style={styles.body}>
                <View style={styles.predictionsOuterContainer}>
                    <View style={styles.predictionsInnerContainer}>
                        <View style={styles.predictionsList}>
                            <View style={styles.predictionImageContainer}>
                                <Image 
                                    style={styles.predictionImageStyle}
                                    source={require('../images/volcano.png')}
                                />
                            </View>
                            <View style={{flex: 2}}>
                            {!volcanoDates ? <ActivityLoading title="Loading Volcano Predictions" /> : (
                                volcanoDates.length === 0 ? <Text style={styles.listText}>No Future Volcano Eruptions Predicted for your location. Please ensure to keep in contact with your local news for any information.</Text> : (
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{marginTop: 15, marginBottom:15}}>
                                            <Text style={styles.predictionsListText}>Predicted Volcano Eruptions for your location</Text>
                                        </View>
                                        <FlatList
                                            data={volcanoDates}
                                            KeyExtractor={({ id }, index) => id}
                                            renderItem={ ({ item }) => (
                                                <View style={styles.dateContainer}>
                                                    <Text style={styles.dateText}>{item.date}</Text>
                                                </View>
                                            )}
                                        />
                                    </View>
                                )
                            )}
                            </View>
                        </View>          
                    </View>
                    <View style={styles.predictionsInnerContainer}>
                        <View style={styles.predictionsList}>
                            <View style={styles.predictionImageContainer}>
                                <Image 
                                    style={styles.predictionImageStyle}
                                    source={require('../images/earthquake.png')}
                                />
                            </View>
                            <View style={{flex: 2}}>
                            {!earthquakeDates ? <ActivityLoading title="Loading Earthquake Predictions" /> : (
                                earthquakeDates.length === 0 ? <Text style={styles.listText}>No Future Earthquakes Predicted for your location. Please ensure to keep in contact with your local news for any information.</Text> : (
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{marginTop: 15, marginBottom:15}}>
                                            <Text style={styles.predictionsListText}>Predicted Earthquakes for your location</Text>
                                        </View>
                                        <FlatList
                                            data={earthquakeDates}
                                            KeyExtractor={({ id }, index) => id}
                                            renderItem={ ({ item }) => (
                                                <View style={styles.dateContainer}>
                                                    <Text style={styles.dateText}>{item.date}</Text>
                                                </View>
                                            )}
                                        />
                                    </View>
                                )
                            )}
                            </View>
                        </View>          
                    </View>
                </View>
            </View>
        </PageLayout>
    )
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        padding: 5
    },
    predictionsOuterContainer: {
        flex: 1,
        padding: 15,
        backgroundColor: '#F1F0EE'
    },
    predictionsInnerContainer: {
        flexDirection: 'row',
        flex: 1,
        marginBottom: 20
    },
    predictionImageContainer: {
        flex: 1,
        padding: 5
    },
    predictionImageStyle: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain'
    
    },
    predictionsList: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.4,
        elevation: 5,
        borderRadius: 10
    },
    predictionsListText: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 15,
        textAlign: 'center',
        color: 'black',
        padding: 5
    },
    dateText: {
        fontFamily: 'IBMPlexSans-Bold',
        fontSize: 15,
        textAlign: 'center',
        color: 'white'
    },
    dateContainer: {
        flex: 1,
        backgroundColor: '#800000',
        padding: 10,
        borderRadius: 10
    }
});

export default Predictions;