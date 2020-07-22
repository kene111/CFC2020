import * as Font from 'expo-font';

const fetchFonts = () =>{ 
    return Font.loadAsync({
    'IBMPlexSans-Bold': require('./assets/fonts/IBMPlexSans-Bold.ttf'),
    'IBMPlexSans-Light': require('./assets/fonts/IBMPlexSans-Light.ttf'),
    'IBMPlexSans-Medium': require('./assets/fonts/IBMPlexSans-Medium.ttf'),
})};

export default fetchFonts;