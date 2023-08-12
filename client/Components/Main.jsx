import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import Registered from './AuthComp/Registered';
import NotRegistered from "./AuthComp/NotRegistered";
import { MainContext } from './Context/MainContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Server_path } from '../utils/api-url';

export default function Main() {
    const { authenticated, setAuthenticated, userEmail, setUserEmail } = useContext(MainContext);
    const [content, setContent] = useState(false);
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
        loadCompletedTask(userEmail);
        loadPendingTask(userEmail);
        retrieveUserData();
        setContent(true);
    }, [setAuthenticated, setUserEmail]);
    const loadPendingTask = async (userEmail) => {
        try {
            console.log(userEmail, Server_path);
            const response = await fetch(`${Server_path}/api/tasks/getPendingTaskList/${userEmail}`);
            if (response.ok) {
                const data = await response.json();
                setPendingTaskList(data);
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const loadCompletedTask = async (userEmail) => {
        try {
            console.log(userEmail, Server_path);
            const response = await fetch(`${Server_path}/api/tasks/getCompletedTaskList/${userEmail}`);
            if (response.ok) {
                const data = await response.json();
                setCompletedTaskList(data);
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    const getContent = () => {
        if (!content) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
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