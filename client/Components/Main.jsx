import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import Registered from './AuthComp/Registered';
import NotRegistered from "./AuthComp/NotRegistered";
import { MainContext } from './Context/MainContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Main() {
    const { authenticated, setAuthenticated } = useContext(MainContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const retrieveUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);
                    // Use the retrieved user data to authenticate the user
                    console.log('User data retrieved successfully:', userData);
                    setAuthenticated(true);
                } else {
                    // User data does not exist
                    console.log('User data not found. Redirect to login.');
                    setAuthenticated(false);
                }
            } catch (error) {
                console.log('Error retrieving user data:', error);
            }
            setIsLoading(false);
        };

        retrieveUserData();
    }, [setAuthenticated]);

    const getContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" />;
        }
    }
    return (
        <NavigationContainer>
            <View styles={styles.container}>
                {getContent()}
            </View>
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