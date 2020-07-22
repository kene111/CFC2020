import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import Loading from './screens/loading';
import Home from './screens/home';
import Chat from './screens/chat';
import Map from './screens/map';
import News from './screens/news';
import Tweets from './screens/tweets';
import About from './screens/about';
import Contact from './screens/contact';
import sChat from './screens/chat2';
import Tester from './screens/tester';
import MapsHere from './screens/maps-here';
import Predictions from './screens/predictions';

import { HomeIcon, ChatIcon, MapIcon } from './images/svg-icons.js';
import { HomeTabIcon, NewsTabIcon, TweetsTabIcon, AboutTabIcon, ContactTabIcon, PredictionsTabIcon } from './tab-icons';

import { AppLoading } from 'expo';

import fetchFonts from './ibm-fonts';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const tabBarOptions = {
  activeTintColor: '#1062FE',
  inactiveTintColor: '#000',
  style: {
    backgroundColor: '#F1F0EE',
    paddingTop: 5
  },
  keyboardHidesTabBar: true
};

const DrawerContent = props => (
  <DrawerContentScrollView {...props}>
    <View style={{flex: 1}}>
    <View style={{height: '100%', width: '100%', flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center', paddingLeft: 20, marginBottom: 40, borderBottomColor: '#c0c0c0', borderBottomWidth: 1}}>
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Image 
            style={styles.image}
            source={require('./images/logo-512.png')}
        />
      </View>
      <View style={{flex: 3, marginLeft: 20}}>
      <Text style={{fontFamily: 'IBMPlexSans-Medium', fontSize: 27}}>N.D.I.A</Text>
      </View>
      </View>
    </View>
    <View style={{flex: 7, marginTop: 40}}>
    <DrawerItemList {...props} />
    </View>
  </DrawerContentScrollView>
  );

const TabLayout = () => (
  <Tab.Navigator
    style={{paddingTop: 50}}
    initialRouteName='Home'
    tabBarOptions={tabBarOptions} >
    <Tab.Screen
      name='Home'
      component={Home}
      options={{
        tabBarIcon: ({color}) => (<HomeIcon fill={color} />)
      }}
    />
    <Tab.Screen
      name='Chat'
      component={sChat}
      options={{
        tabBarIcon: ({color}) => (<ChatIcon fill={color} />)
      }}
    />
    <Tab.Screen
    name='Map'
    component={Map}
    options={{
      tabBarIcon: ({color}) => (<MapIcon fill={color} />)
    }}
    />
  </Tab.Navigator>
);

const DrawerLayout = () => {
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
    <Drawer.Navigator 
      initialRouteName='Home'
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: '#1062FE',
        inactiveTintColor: '#000',
        itemStyle: {marginVertical: 5},
        labelStyle: {
          fontFamily: 'IBMPlexSans-Light',
          fontSize: 16
        }
      }} >
      <Drawer.Screen 
        name='Home' 
        component={TabLayout}
        options={{
          drawerIcon: () => (<HomeTabIcon />)
        }} 
      />
      <Drawer.Screen 
        name='News' 
        component={News}
        options={{
          drawerIcon: () => (<NewsTabIcon />)
        }}
      />
      <Drawer.Screen 
        name='Tweets' 
        component={Tweets}
        options={{
          drawerIcon: () => (<TweetsTabIcon />)
        }} 
      />
      <Drawer.Screen 
        name='Predictions' 
        component={Predictions}
        options={{
          drawerIcon: () => (<PredictionsTabIcon />)
        }}
      />
      <Drawer.Screen 
        name='About' 
        component={About}
        options={{
          drawerIcon: () => (<AboutTabIcon />)
        }}
      />
      <Drawer.Screen 
        name='Contact Center' 
        component={Contact}
        options={{
          drawerIcon: () => (<ContactTabIcon />)
        }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if(isLoading) {
    return (<Loading />);
  } else{
    return (
      <NavigationContainer>
        <DrawerLayout />
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  imageContainer: {
    height: '20%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:40
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'center'
  },
  headerStyle: {
    fontSize: 20,
    color: '#323232',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navicon: {
      flex: 1
  },
  headerZone: {
      flex: 2
  },
  imageZone: {
      flex: 1
  }
});