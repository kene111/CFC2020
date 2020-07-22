import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

import * as Location from 'expo-location';

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1
  }
});

const hereApikey = 'zNgHoiWMcKRwdEeZ4j_TRXwgum4Hicw3fNHo5tFQYXc';

const MapsHere = () => {
    
    
  const webView = useRef(null);

  const onMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);

    if (message.status && message.status === 'initialized') {
        let location = Location.getCurrentPositionAsync({});
        sendMessage(location);
    }
  };

  const sendMessage = (data) => {
    const message = 
      `(function() {
        document.dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(data)}}));
      })()`;

    webView.current.injectJavaScript(message);
  }

  const sourceUri = (Platform.OS === 'android' ? 'file:///android_asset/' : '') + 'Web.bundle/loader.html';
  const injectedJS = `
    if (!window.location.search) {
      var link = document.getElementById('progress-bar');
      link.href = './site/here.html?apikey=${hereApikey}';
      link.click();
    }
  `;

  return (
    <View style={styles.mapContainer}>
      <WebView          
        injectedJavaScript={injectedJS}
        source={{ uri: sourceUri }}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        allowFileAccess={true}
        onMessage={onMessage}
        ref={webView}
      />
    </View>
  );
};

export default MapsHere;
