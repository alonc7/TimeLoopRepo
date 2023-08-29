import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Registered from './AuthComp/Registered';
import NotRegistered from './AuthComp/NotRegistered';
import { MainContext } from './Context/MainContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';


import COLORS from '../constants/colors';
export default function Main() {
    const { authenticated, setAuthenticated, setUserName, setUserEmail, loadTasks, loadLocalTasks } = useContext(MainContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Track errors during API requests

    useEffect(() => {
        retrieveUserData();
    }, [setAuthenticated, setUserEmail]);

    const retrieveUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');

            if (userDataString !== null) {
                const userData = JSON.parse(userDataString);
                setUserEmail(userData.email)
                setUserName(userData.name);
                await loadTasks(userData.email);
                loadLocalTasks(); // Load tasks from local storage
                setAuthenticated(true);

            } else {
                console.log('User data not found. Redirect to login.');
                setAuthenticated(false);
                setIsLoading(false); // Set loading state to false in case of no user data
            }
        } catch (error) {
            console.log('Error retrieving user data:', error);
            setError('Error retrieving user data'); // Set error state for user feedback
        } finally {
            setIsLoading(false); // Regardless of success or error, set loading state to false
        }
    };



    const getContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingMessageContainer}>
                        <ActivityIndicator size="large" color={COLORS.red} />
                        <Text style={styles.messageText}>
                            Loading data{'\n'}{'\n'} this might take a few seconds
                        </Text>
                    </View>
                </View>
            );
        } else if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        } else {
            // Display the appropriate content based on the authentication state
            return authenticated ? <Registered /> : <NotRegistered />;
        }
    };

    return (
        <NavigationContainer>
            {getContent()}
            {/* <NotificationComp  /> */}
            {/* <Text style={styles.messageText}>"Please wait while we gather the information. This may take a few seconds. Thank you for your patience."</Text> */}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: 44,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44,
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.red,
        textAlign: 'center',
    },
    messageText: {
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
        color: COLORS.white
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black, // Change to desired background color
    },
    loadingMessageContainer: {
        // backgroundColor: COLORS.white, // Semi-transparent background for the loading message
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
});
