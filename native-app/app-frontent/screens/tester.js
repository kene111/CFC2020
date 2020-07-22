import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import PageLayout from '../components/page-layout';
import ContactComponent from '../components/contact-component';

const contactServices = [
    {
        id: 0,
        name: 'American Red Cross',
        logoSource: require('../images/american-red-cross.png'),
        number: '0'
    },
    {
        id: 1,
        name: 'FEMA',
        logoSource: require('../images/fema-logo.jpg'),
        number: '0'
    },
    {
        id: 2,
        name: 'NFIP',
        logoSource: require('../images/nfip-logo.png'),
        number: '0'
    }
]

export const Contact = ({ navigation }) => {

    return (
        <PageLayout 
            header='Get Help'
            isImage={true}
            imageSource= {require('../images/get-help.png')}
            nav={navigation}
        >
            <View style={{marginTop: 20}}>
            <FlatList
                data={contactServices}
                KeyExtractor={({ id }, index) => id}
                renderItem={ ({ item }) => (
                    <View style={{marginBottom: 10}}>
                        <ContactComponent 
                            contactName={item.name}
                            imageSource={item.logoSource}
                            phoneNumber={item.number}  
                        />
                    </View>
                )}
            /> 
            </View>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    listStyle: {
        marginTop: 20,
        padding: 20
    }
});

export default Contact;