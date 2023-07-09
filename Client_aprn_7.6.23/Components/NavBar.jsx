import React from 'react'
//  { Component } from 'react'
// import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../Pages/HomeScreen'
import ScheduleScreen from '../Pages/ScheduleScreen'
// import TasksScreen from '../Pages/TasksScreen'
import TasksScreen from '../Pages/TasksScreen'
import SettingsScreen from '../Pages/SettingsScreen'
import Ionicons from 'react-native-vector-icons/Ionicons';
// import COLORS from '../constants/colors'

const NavBar = () => {
  const Tab = createBottomTabNavigator();
  return (
    <>
      <Tab.Navigator
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
          },
        })}
        tabBarOptions={{
          "tabBarActiveTintColor": "tomato",
          "tabBarInactiveTintColor": "gray",
          "tabBarLabelStyle": {
            "fontSize": 12
          },
          "tabBarStyle": [
            {
              "display": "flex"
            },
            null
          ]
        }}>
        <Tab.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name='Tasks' component={TasksScreen} options={{ headerShown: false }} />
        <Tab.Screen name='Schedule' component={ScheduleScreen} options={{ headerShown: false }} />
        <Tab.Screen name='Settings' component={SettingsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </>
  )
}

// export default NavBar
