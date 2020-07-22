import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import PageLayout from '../components/page-layout';
import TweetsLayout from '../components/tweets-layout';
import ActivityLoading from '../components/activity-loading';

export const Tweets = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const getTweets = () => {
        fetch('https://ndia-api-boisterous-duiker-ts.eu-gb.mybluemix.net/tweets')
            .then((response) => response.json())
            .then((responseJson) => setData(responseJson))
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false)
                setRefreshing(false)
            });
    }

    useEffect(() => {
        getTweets()
    }, []);

    const onRefresh =  useCallback(() => {
        setRefreshing(true);
        getTweets()
    }, [refreshing]);


    return (
        <PageLayout 
            header='Disaster Tweets'
            isImage={true}
            imageSource= {require('../images/twitter-logo.png')}
            nav={navigation}
        >
                {isLoading ? <ActivityLoading title="Loading Disaster Tweets" />: (
                    <View style={styles.body}>
                        <FlatList
                            data={data}
                            KeyExtractor={({ id }, index) => id}
                            renderItem={ ({ item }) => (
                                <TweetsLayout
                                    username={item.username}
                                    userHandle={item.user_handle}
                                    tweet={item.tweet}
                                    date={item.day_created}
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

export default Tweets;