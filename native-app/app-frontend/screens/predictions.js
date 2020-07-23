import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';

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
                <View style={styles.outerContainer}>
                    <View style={styles.innerContainer}>
                        <View style={styles.heading}>
                            <Text style={styles.name}>Volcano Eruption Predictions</Text>
                        </View>
                        <View style={styles.list}>
                        {!volcanoDates ? <ActivityLoading title="Loading Volcano Predictions" /> : (
                            volcanoDates.length === 0 ? <Text style={styles.listText}>No Probable Volcano Eruptions Predicted</Text> : (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{marginTop: 10, marginBottom:10}}>
                                        <Text style={styles.listText}>Dates Volcano Eruptions are predicted to have a high possibility of occuring</Text>
                                    </View>
                                    <FlatList
                                        data={volcanoDates}
                                        KeyExtractor={({ id }, index) => id}
                                        renderItem={ ({ item }) => (
                                            <Text style={styles.listText}>{item.date}</Text>
                                        )}
                                    />
                                </View>
                            )
                        )}
                        </View>
                    </View>
                    <View style={styles.innerContainer}>
                        <View style={styles.heading}>
                            <Text style={styles.name}>Earthquake Predictions</Text>
                        </View>
                        <View style={styles.list}>
                        {!volcanoDates ? <ActivityLoading title="Loading Earthquake Predictions" /> : (
                            volcanoDates.length === 0 ? <Text style={styles.listText}>No Probable Earthquakes Predicted</Text> : (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{marginTop: 10, marginBottom:10}}>
                                        <Text style={styles.listText}>Dates Earthquakes are predicted to have a high possibility of occuring</Text>
                                    </View>
                                    <FlatList
                                        data={earthquakeDates}
                                        KeyExtractor={({ id }, index) => id}
                                        renderItem={ ({ item }) => (
                                            <Text style={styles.listText}>{item.date}</Text>
                                        )}
                                    />
                                </View>
                            )
                        )}
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
        padding: 10
    },
    outerContainer: {
        flex: 1,
        padding: 10 
    },
    innerContainer: {
        flexDirection: 'row',
        flex: 1,
        marginBottom: 20
    },
    heading: {
        width: '35%',
        height: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        fontFamily: 'IBMPlexSans-Medium',
        fontSize: 16,
        color: 'blue'
    },
    list: {
        height: '100%',
        width: '65%',
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
    listText: {
        fontFamily: 'IBMPlexSans-Light',
        fontSize: 15,
        textAlign: 'center',
        color: 'red'
    }
});

export default Predictions;