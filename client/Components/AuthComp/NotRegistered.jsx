import { View, Text } from 'react-native'
import React from 'react'
import Welcome from '../../Pages/WelcomeScreen';
import Signup from "../../Pages/SignupScreen";
import Login from "../../Pages/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function NotRegistered() {

    return (
        <Stack.Navigator
            initialRouteName='Welcome'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Welcome"
                component={Welcome}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
            />
            <Stack.Screen
                name="Login"
                component={Login}
            />            
        </Stack.Navigator>

    )
}