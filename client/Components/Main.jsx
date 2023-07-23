import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import Registered from './AuthComp/Registered';
import NotRegistered from "./AuthComp/NotRegistered";
import { MainContext } from './Context/MainContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Main() {
    const { authenticated, setAuthenticated, userEmail, setUserEmail } = useContext(MainContext);

    useEffect(() => {
        const retrieveUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);
                    // Use the retrieved user data to authenticate the user
                    setUserEmail(userData.email)
                    setAuthenticated(true);
                } else {
                    // User data does not exist
                    console.log('User data not found. Redirect to login.');
                    setAuthenticated(false);
                }
            } catch (error) {
                console.log('Error retrieving user data:', error);
            }
        };

        retrieveUserData();
    }, [setAuthenticated, setUserEmail]);
    const getContent = () => {
       
    }
    return (
        <NavigationContainer>
            {authenticated ? <Registered /> : <NotRegistered />}
        </NavigationContainer>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});