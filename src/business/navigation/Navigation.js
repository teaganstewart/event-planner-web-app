import React from 'react';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

// Imports the required external pages 
import AccountScreen from '../../presentation/AccountScreen'
import CalendarScreen from '../../presentation/CalendarScreen'
import HomeScreen from '../../presentation/HomeScreen'
import MapScreen from '../../presentation/MapScreen'

/* Provides the main bottom tab navigation through the app. Is used on the home page and creates
navigation to the account, map and calendar pages. */
export const TabNavigator = createBottomTabNavigator({

  // Naivgation to the main home screen
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      activeTintColor: '#000',
      header: null,
      tabBarVisible: true,
      tabBarIcon: ({ focused, tintColor }) => {
        const iconName = `ios-home`;
        return <Ionicons name={iconName} size={25} color={focused ? "#2bc475" : "000000"} />;
      },
    })
  },
  // Navigation to the calendar screen that provides the monthly view
  Calendar: {
    screen: CalendarScreen,
    navigationOptions: () => ({
      header: null,
      tabBarVisible: false,
      tabBarIcon: ({ focused, tintColor }) => {
        const iconName = `ios-calendar`;
        return <Ionicons name={iconName} size={25} color={focused ? "#2bc475" : "000000"} />;
      },
    })
  },
  // Navigation to the map screen that shows the location of all events
  Map: {
    screen: MapScreen,
    navigationOptions: () => ({
      header: null,
      tabBarVisible: false,
      tabBarIcon: ({ focused, tintColor }) => {
        const iconName = `ios-map`;
        return <Ionicons name={iconName} size={25} color={focused ? "#2bc475" : "000000"} />;
      },
    })
  },
  // Navigation to the account screen, where you can logout
  Account: {
    screen: AccountScreen,
    navigationOptions: () => ({
      header: null,
      tabBarVisible: false,
      tabBarIcon: ({ focused, tintColor }) => {
        const iconName = `ios-people`;
        return <Ionicons name={iconName} size={25} color={focused ? "#2bc475" : "000000"} />;
      },
    })
  },
});
