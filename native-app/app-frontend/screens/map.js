import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, Keyboard, FlatList, Alert, SafeAreaView, Image } from 'react-native';

import { decode } from "@mapbox/polyline";

import * as Location from 'expo-location';
import { AppLoading } from 'expo';

import apiKeys from '../api-keys';
import fetchFonts from '../ibm-fonts';

import PageLayout from '../components/page-layout';
import LoadingPage from '../components/loading-page';
import HospitalComponent from '../components/hospital-component';
import { ArrowBackIcon, SearchIcon, CloseIcon, MessageAlertIcon, HospitalBoxIcon, MapExitIcon } from '../tab-icons';
import { error } from 'react-native-gifted-chat/lib/utils';

const getDirections = async (startLoc, destinationLoc) => {
    try {
        const KEY = apiKeys.directionsApiKey;
        let resp = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`
        );
        let respJson = await resp.json();
        let points = decode(respJson.routes[0].overview_polyline.points);
        let distanceDuration = {
            distance: respJson.routes[0].legs[0].distance.text,
            duration: respJson.routes[0].legs[0].duration.text
        };
        let coords = points.map((point, index) => {
            return {
                latitude: point[0],
                longitude: point[1]
            };
        });
        return {respCoords: coords, distTime: distanceDuration};
    } catch (error) {
        return error;
    }
}

const getLatLng = async (destination) => {
    try {
        const KEY = apiKeys.geocoderApiKey;
        let resp = await fetch (`https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${KEY}`, {
        method: 'GET',    
        headers: {
                'Content-Type': 'application/json'
            }
        });
        let respJson = await resp.json();
        let longlat = respJson.results[0].geometry.location;
        return {
            latitude: longlat.lat,
            longitude: longlat.lng
        }
    } catch (error) {
        return error;
    }
}
const reverseGeocoder = async (userCoords) => {
    try {
        const KEY = apiKeys.geocoderApiKey;
        let resp = await fetch (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userCoords.latitude},${userCoords.longitude}&key=${KEY}`, {
        method: 'GET',    
        headers: {
                'Content-Type': 'application/json'
            }
        });
        let respJson = await resp.json();
        return respJson.results[0].formatted_address
    } catch (error) {
        return error;
    }
}

const getPlaces = async (currentPosition, place) => {
    try {
        const KEY = apiKeys.placesApiKey;
        let resp = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentPosition}&radius=2000&types=${place}&key=${KEY}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let respJson = await resp.json();
        return respJson.results;
    } catch (error) {
        return error;
    }
}

const CustomMarker = props => {
    return (
        <View style={styles.markerStyle}>
            <Text style={styles.markerText}>{props.distance}</Text>
            <Text style={styles.markerText}>{props.duration}</Text>
        </View>
    )
}

const FlipMarker = props => {
    return (
        <View style={styles.markerStyle}>
            <Text style={styles.markerText}>Disaster reported at</Text>
            <Text style={styles.markerText}>{props.vicinity}</Text>
        </View>
    )
}

export const Map = ({ navigation }) => {
    const [coords, setCoords] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [destination, setDestination] = useState('');
    const [destinationLngLat, setDestinationLngLat] = useState(null);
    const [hospitalList, setHospitalList] = useState(null);
    const [isSearchMode, setIsSearchhMode] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [inputScreenText, setInputScreenText] = useState('Select Destination');
    const [distanceTime, setDistanceTime] = useState({});
    const [disasterLatLng, setDisasterLatLng] = useState([]);
    const [markerFlip0, setMarkerFlip0] = useState(false);
    const [markerFlip1, setMarkerFlip1] = useState(false);
    const [markerFlip2, setMarkerFlip2] = useState(false);
    const [markerFlip3, setMarkerFlip3] = useState(false);
    const [markerFlip4, setMarkerFlip4] = useState(false);
    

    const _map = useRef(null);

    const Berlin = {
        latitude: 6.46391,
        longitude: 3.2824227
    };

    const Frankfurt = {
        latitude: 6.5161,
        longitude: 3.3886
    }

    const arrowBackHandler = () => {
        setIsSearchhMode(false);
        if(destination == '') {
            setInputScreenText('Select Destination')            
        }
    }

    const destinationInputHandler = (enteredText) => {
        setDestination(enteredText)
        setInputScreenText(enteredText)
    };

    const getDisasterLocations = async (latitude, longitude) => {
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
        await fetch('https://ndia-api-boisterous-duiker-ts.eu-gb.mybluemix.net/disaster_locations', data)
            .then(resp => {return resp.json()})
            .then(respJson => {
                setDisasterLatLng(respJson);
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status != 'granted') {
                setErrorMsg('Permission to access location was denied. Please go to settings and enable location for the application');
            }
            const interval = setInterval(async () => {
                let myLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: myLocation.coords.latitude,
                    longitude: myLocation.coords.longitude
                });
                await getDisasterLocations(myLocation.coords.latitude, myLocation.coords.longitude);
            }, 3000);
            return () => clearInterval(interval)
        })();

    }, []);

    const searchDestinationHandler = async () => {
        if (destination === '') {
            return;
        } else {
            setIsSearchhMode(false);
            let resp = await getLatLng(destination);
            setDestinationLngLat(resp);
            console.log(JSON.stringify(resp));
            getDirections(`${location.latitude},${location.longitude}`, `${resp.latitude},${resp.longitude}`)
                .then(response => {
                    setCoords(response.respCoords);
                    setDistanceTime(response.distTime);
                })
                .catch(err => console.log("Something went wrong"));
            }
    };

    const findHospitalHandler = async () => {
        Keyboard.dismiss();
        let resp = await getPlaces(`${location.latitude},${location.longitude}`, 'hospital');
        let hospitals = [];
        for (var i=0; i<resp.length; i++) {
            hospitals.push({
                name: resp[i].name,
                id: resp[i].place_id,
                vicinity: resp[i].vicinity,
                latLng: {
                    latitude: resp[i].geometry.location.lat,
                    longitude: resp[i].geometry.location.lng
                }
            })
        }
        setHospitalList(hospitals);
    };

    const onPressHospitalHandler = async (hospital) => {   
        setIsSearchhMode(false);
        
        await getDirections(`${location.latitude},${location.longitude}`, `${hospital.latLng.latitude},${hospital.latLng.longitude}`)
            .then(response => {
                setCoords(response.respCoords);
                setDistanceTime(response.distTime);
            })
            .catch(err => console.log("Something went wrong"));
        
        setDestinationLngLat(hospital.latLng);
        setDestination(hospital.name);
        setInputScreenText(hospital.name);
    }

    const onFocusHandler = () => {
        setIsSearchhMode(true);
        setHospitalList(null);
    }

    const sendLocationHandler = async () => {
        let vicinity = await reverseGeocoder(location);
        await fetch(`https://ndia-api-boisterous-duiker-ts.eu-gb.mybluemix.net/send_location?user_vicinity=${vicinity}&user_latitude=${location.latitude}&user_longitude=${location.longitude}`)
            .then(resp => {return resp.text()})
            .then(respText => {
                if(respText == 'Mail Sent') {
                    Alert.alert(
                        'Location Sent',
                        'Your current location has successfully been sent',
                        [
                            {
                                text: 'Close',
                                onPress: () => {},
                                style: 'cancel' 

                            }
                        ],
                        {cancelable: false}
                    )
                } else {
                    Alert.alert(
                        'Unable to Send',
                        'Your current location could not be sent. Please check your internet connection and try again',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel' 

                            },
                            {
                                text: 'Try Agin',
                                onPress: () => {sendLocationHandler},

                            }
                        ],
                        {cancelable: false}
                    )
                }
            })
            .catch(err => console.error(err))
        
    }

    const onPressMessageAlertHandler = () => {
        Alert.alert(
            'Send Location',
            'Would you like to send your current location for help? ',
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => sendLocationHandler(),
                }
            ],
            {cancelable: false}
        )
    };

    const onPressExitHandler = () => {
        setCoords([]);
        setDestinationLngLat(null);
        setDestination('');
        setInputScreenText('Select Destination');
        setDistanceTime({});
    }

    const MapFitter = () => {
        if(!destinationLngLat) {
            return ;
        } else {
            _map.fitToCoordinates(
                [location, destinationLngLat], 
                {
                    edgePadding: {
                        top: 50,
                        right: 50,
                        bottom: 50,
                        left: 50
                    }
                }
            )
        }
    }

    let text = 'Loading Maps';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    let rend;

    if (!location) {
        rend = (
            <LoadingPage 
                image={require('../images/google-maps-side-logo.jpg')}
                loadingText={text}
            />
        )
    } else {
        rend = (
            <View style={styles.container}>
                <MapView 
                    ref={_map}
                    provider={MapView.PROVIDER_GOOGLE}
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }}
                    showsUserLocation={true}
                >
                    {disasterLatLng[0] && !markerFlip0 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[0].latitudeField), longitude: parseFloat(disasterLatLng[0].longitudeField)}}
                            onPress={() => {setMarkerFlip0(true)}}
                        />
                    }
                    {disasterLatLng[0] && markerFlip0 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[0].latitudeField), longitude: parseFloat(disasterLatLng[0].longitudeField)}}
                            onPress={() => {setMarkerFlip0(false)}}
                        >    
                            <FlipMarker vicinity={disasterLatLng[0].addressField} />
                        </Marker>
                    }
                    {disasterLatLng[1] && !markerFlip1 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[1].latitudeField), longitude: parseFloat(disasterLatLng[1].longitudeField)}}
                            onPress={() => {setMarkerFlip1(true)}}
                        />
                    }
                    {disasterLatLng[1] && markerFlip1 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[1].latitudeField), longitude: parseFloat(disasterLatLng[1].longitudeField)}}
                            onPress={() => {setMarkerFlip1(false)}}
                        >    
                            <FlipMarker vicinity={disasterLatLng[1].addressField} />
                        </Marker>
                    }
                    {disasterLatLng[2] && !markerFlip2 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[2].latitudeField), longitude: parseFloat(disasterLatLng[2].longitudeField)}}
                            onPress={() => {setMarkerFlip2(true)}}
                        />
                    }
                    {disasterLatLng[2] && markerFlip2 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[2].latitudeField), longitude: parseFloat(disasterLatLng[2].longitudeField)}}
                            onPress={() => {setMarkerFlip2(false)}}
                        >    
                            <FlipMarker vicinity={disasterLatLng[2].addressField} />
                        </Marker>
                    }
                    {disasterLatLng[3] && !markerFlip3 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[3].latitudeField), longitude: parseFloat(disasterLatLng[3].longitudeField)}}
                            onPress={() => {setMarkerFlip3(true)}}
                        />
                    }
                    {disasterLatLng[3] && markerFlip3 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[3].latitudeField), longitude: parseFloat(disasterLatLng[3].longitudeField)}}
                            onPress={() => {setMarkerFlip3(false)}}
                        >    
                            <FlipMarker vicinity={disasterLatLng[3].addressField} />
                        </Marker>
                    }
                    {disasterLatLng[4] && !markerFlip4 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[4].latitudeField), longitude: parseFloat(disasterLatLng[4].longitudeField)}}
                            onPress={() => {setMarkerFlip4(true)}}
                        />
                    }
                    {disasterLatLng[4] && markerFlip4 &&
                        <Marker 
                            coordinate={{latitude: parseFloat(disasterLatLng[4].latitudeField), longitude: parseFloat(disasterLatLng[4].longitudeField)}}
                            onPress={() => {setMarkerFlip4(false)}}
                        >    
                            <FlipMarker vicinity={disasterLatLng[4].addressField} />
                        </Marker>
                    }
                    {destinationLngLat && distanceTime !== {} && 
                        <Marker coordinate={destinationLngLat}>
                            <CustomMarker distance={distanceTime.distance} duration={distanceTime.duration} />
                        </Marker>
                    }
                    {coords.length > 0 && <Polyline coordinates={coords} strokeWidth={3} />}
                </MapView>
                <TouchableOpacity style={styles.inputContainer} onPress={onFocusHandler}>    
                    <Text style={styles.placeholderStyle}>{inputScreenText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exitIcon} activeOpacity={0.9} onPress={onPressExitHandler}>
                    <MapExitIcon />
                </TouchableOpacity>
                <View style={styles.messageIcon}>
                    <TouchableOpacity activeOpacity={0.9} onPress={onPressMessageAlertHandler}>
                        <MessageAlertIcon />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

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
            header='Get Assistance'
            isImage={true}
            imageSource= {require('../images/google-maps-opening-logo.jpg')}
            nav={navigation}
        >
            <Modal visible={isSearchMode} transparent={true} animationType='slide'>
                <SafeAreaView style={{backgroundColor: '#F1F0EE', flex: 1}}>
                    <View style={styles.modalContainer}>
                            <View style={styles.modalInputContainer}>
                                <View style={styles.modalSearchBar}>
                                    <View style={styles.arrow}>
                                        <TouchableOpacity onPress={arrowBackHandler}>
                                            <ArrowBackIcon />
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                    placeholder="Select Destination"
                                    style={styles.modalInputStyle}
                                    onChangeText={destinationInputHandler}
                                    value={destination}
                                    autoFocus={true}
                                    />
                                    <View style={styles.closeIcon}>
                                        {destination == '' ? <View></View> : (
                                            <TouchableOpacity onPress={() => {setDestination('')}}>
                                                <CloseIcon />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={styles.searchIcon}>
                                        <TouchableOpacity onPress={searchDestinationHandler}>
                                            <SearchIcon />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.listStyle}>
                                <View style={styles.outerHospitalButton}>
                                    <TouchableOpacity activeOpacity={0.9} onPress={findHospitalHandler}>
                                        <View style={styles.hospitalButton}>
                                                <View style={styles.hospitalIcon}>
                                                    <HospitalBoxIcon />
                                                </View>
                                                <View style={styles.hospitalTextContainer}>
                                                    <Text style={styles.hospitalText}>Locate</Text>
                                                    <Text style={styles.hospitalText}>Nearest Hospitals</Text>
                                                </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                    {hospitalList && <FlatList
                                        contentContainerStyle={styles.hospitalListStyle}
                                        data={hospitalList}
                                        KeyExtractor={({ id }, index) => id}
                                        renderItem={ ({ item }) => (
                                            <HospitalComponent 
                                                name={item.name}
                                                vicinity={item.vicinity}
                                                onPressHospital={onPressHospitalHandler.bind(this, item)}
                                            />
                                        )}
                                    />}
                            </View>

                    </View>
                </SafeAreaView>
            </Modal>
            {rend}
        </PageLayout>
        
    );
    
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapStyle: {
        marginTop: 7,
        width: '100%',
        height: '100%'
    },
    inputContainer : {
        height: '8%',
        width: "85%",
        marginTop: 7,
        position: 'absolute',
        top: 10, 
        backgroundColor: 'white',
        borderColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 7,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        elevation: 5,
        borderRadius: 10

    },
    modalContainer: {
      flex: 1,
      backgroundColor: '#F1F0EE'
    },
    modalInputContainer: {
        padding: 10,
        flex: 1,
        width: '100%',
        marginTop: 15,
    },
    modalSearchBar: {
        height: '100%',
        padding: 10,
        flexDirection: 'row',
        borderColor: 'grey',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    modalInputStyle: {
        height: '100%',
        borderColor: 'white',
        backgroundColor: 'white',
        borderWidth: 1,
        flex: 7,
        fontSize: 17,
        fontFamily: 'IBMPlexSans-Light',
        fontWeight: '700'
    },
    arrow: {
        flex: 1
    },
    searchIcon: {
        flex: 1,
        alignItems: 'flex-end'
    },
    closeIcon: {
        flex: 1,
    },
    outerHospitalButton: {
        padding: 20
    },
    hospitalButton: {
        width: '65%',
        marginTop: 10,
        marginBottom: 13,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        padding: 7,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        elevation: 5,
        borderRadius: 5
    },
    listStyle: {
        flex: 9,
        width: '100%'
    },
    messageIcon: {
        position: 'absolute',
        padding: 15,
        bottom: 50,
        right: 20,
        borderColor: 'white',
        backgroundColor: 'white',
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        elevation: 5,
        borderRadius: 35
    },
    hospitalIcon: {
        marginRight: 15
    },
    hospitalTextContainer: {

    },
    hospitalText: {
        fontSize: 17,
        fontFamily: 'IBMPlexSans-Medium'
    },
    hospitalListStyle: {
        width: '85%',
        marginTop: 2,
        marginLeft: 20,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        elevation: 5,
        borderRadius: 5
    },
    placeholderStyle: {
        fontSize: 17,
        fontFamily: 'IBMPlexSans-Light',
        color: '#c0c0c0',
    },
    exitIcon: {
        position: 'absolute',
        padding: 15,
        bottom: 140,
        right: 27,
        borderColor: 'white',
        backgroundColor: 'white',
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        elevation: 5,
        borderRadius: 40
    },
    markerStyle: {
        backgroundColor: 'white',
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 7,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        elevation: 5,
        borderRadius: 10
    },
    markerText: {
        fontSize: 10,
        fontFamily: 'IBMPlexSans-Light'

    }
})

export default Map;