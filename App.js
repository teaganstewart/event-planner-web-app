import React from 'react';

import Loader from './src/business/Loader';
import AuthScreen from './src/presentation/AuthScreen';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import useCachedResources from './hooks/useCachedResources';

import {TabNavigator} from './src/business/navigation/Navigation'

// Creates navigator for the loading screen.
const LoadStack = createStackNavigator({
  Load: {
    screen: Loader,
    navigationOptions: () => ({
      header: null
    })
  }
});

// Creates a navigator for the register and login screen.
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


