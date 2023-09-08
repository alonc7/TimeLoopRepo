import React from 'react'
import HomeScreen from "../../Pages/HomeScreen";
import TasksScreen from "../../Pages/TasksScreen";
import ScheduleScreen from "../../Pages/ScheduleScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import COLORS from '../../constants/colors';
import NotificationComp from '../NotificationComp';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Registered() {
    function TabNavigator() {
        return (
            <>
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === 'Home') {
                                iconName = focused ? 'home' : 'home-outline';
                            } else if (route.name === 'Tasks') {
                                iconName = focused ? 'checkmark-done-circle' : 'checkmark-circle-outline';
                            } else if (route.name === 'Schedule') {
                                iconName = focused ? 'calendar' : 'calendar-outline';
                            } else if (route.name === 'Settings') {
                                iconName = focused ? 'settings' : 'settings-outline';
                            }
                            return <Ionicons name={iconName} size={size} color={color} />;
                        }, headerShown: false,
                        tabBarStyle: {
                            display: 'flex',
                        },
                        tabBarLabelStyle: {
                            fontSize: 12,
                            color: '#212529',
                        },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveBackgroundColor: COLORS.white,
                        tabBarActiveBackgroundColor: COLORS.primary,
                    })}
                >
                    <Tab.Screen name="Home" component={HomeScreen} />
                    <Tab.Screen name="Tasks" component={TasksScreen} />
                    <Tab.Screen name="Schedule" component={ScheduleScreen} />
                    {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
                </Tab.Navigator>
                <NotificationComp />
            </>
        );
    }
    return (
        <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
    );
}
