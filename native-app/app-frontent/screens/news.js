import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import PageLayout from '../components/page-layout';
import NewsHeadline from '../components/news-headline';
import ActivityLoading from '../components/activity-loading';

export const News = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const getNews = () => {
        fetch('https://ndia-api-boisterous-duiker-ts.eu-gb.mybluemix.net/news')
            .then((response) => response.json())
            .then((responseJson) => setData(responseJson))
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false)
                setRefreshing(false)
            });
    }

    useEffect(() => {
        getNews()
    }, []);

    const onRefresh =  useCallback(() => {
        setRefreshing(true);
        getNews()
    }, [refreshing]);

    
    return (
        <PageLayout 
            header='Latest Updates'
            isImage={true}
            imageSource={require('../images/newsnow-logo.png')}
            nav={navigation}
        >    
            {isLoading ? <ActivityLoading title="Loading Disaster News" />: (
                <View style={styles.body}>
                    <FlatList
                        data={data}
                        KeyExtractor={({ id }, index) => id}
                        renderItem={ ({ item }) => (
                            <NewsHeadline 
                                headline={item.headline}
                                link={item.link}
                                country={item.country}
                                time={item.time}
                                day={item.day}
                            />
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </View>
            )}      
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    body: {
        marginTop: 5
    }
});

export default News;