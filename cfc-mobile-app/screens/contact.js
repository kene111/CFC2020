import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import PageLayout from '../components/page-layout';
import ContactComponent from '../components/contact-component';

const contactServices = [
    {
        id: '0',
        name: 'American Red Cross Disaster Assistance',
        logoSource: require('../images/american-red-cross.png'),
        number: '1-866-438-4636'
    },
    {
        id: '1',
        name: 'Federal Emergency Management Agency (FEMA)',
        logoSource: require('../images/fema-logo.jpg'),
        number: '1-800-525-0321'
    },
    {
        id: '2',
        name: 'National Flood Insurance Program',
        logoSource: require('../images/nfip-logo.png'),
        number: '1-888-356-6329'
    }
]

export const Contact = ({ navigation }) => {

    return (
        <PageLayout 
            header='Contact Center'
            isImage={true}
            imageSource= {require('../images/get-help.png')}
            nav={navigation}
        >
            <FlatList
                contentContainerStyle={styles.listStyle}
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
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    listStyle: {
        marginTop: 40,
        paddingLeft: 30
    }
});

export default Contact;