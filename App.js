import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import Loader from './src/business/Loader';
import CalendarScreen from './src/presentation/CalendarScreen';
import AccountScreen from './src/presentation/AccountScreen';
import AuthScreen from './src/presentation/AuthScreen';
import HomeScreen from './src/presentation/HomeScreen';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import useCachedResources from './hooks/useCachedResources';
import MapComponent from './src/business/Map';
import MapScreen from './src/presentation/MapScreen';

const LoadStack = createStackNavigator({
  Load: {
    screen: Loader,
    navigationOptions: () => ({
      header: null
    })
  }
});


const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      activeTintColor: '#000',
      header: null,
      tabBarVisible: true,
      tabBarIcon: ({ focused, tintColor }) => {
        const iconName = `ios-home`;
        return <Ionicons name={iconName} size={25} color={focused ? "#2bc475" : "000000"}  />;
      },
    })
  },
  Calendar: {
    screen: CalendarScreen,
    navigationOptions: () => ({
      header: null,
      tabBarVisible: false,
      tabBarIcon: ({ focused, tintColor }) => {
        const iconName = `ios-calendar`;
        return <Ionicons name={iconName} size={25} color={focused ? "#2bc475" : "000000"}  />;
      },
    })
  },
  Map: {
    screen: MapScreen,
    navigationOptions: () => ({
      header: null,
      tabBarVisible: false,
      tabBarIcon: ({ focused, tintColor }) => {
        const iconName = `ios-map`;
        return <Ionicons name={iconName} size={25} color={focused ? "#2bc475" : "000000"}  />;
      },
    })
  },
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


const AuthNavigator = createStackNavigator({
  LoginRoute: {
    screen: AuthScreen,
    navigationOptions: () => ({
      header: null
    })
  }
});

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    Loading: LoadStack,
    App: TabNavigator,
    Auth: AuthNavigator,
    Map: MapComponent
  },
  {
    initialRouteName: 'Auth',
  }
));

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (

      <AppContainer
        screenProps={{ appName: 'PlanTo' }}
      />
    )

  }
}


