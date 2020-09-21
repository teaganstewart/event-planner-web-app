import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { Mode } from 'react-native-popover-view/dist/Constants';
import { login, register, subscribeToAuthChanges } from '../business/FirebaseSetup'
import Loader from '../business/Loader';

import { CustomTextInput, AppButton } from '../business/MainComponents'
import { loginStyles, generalStyles } from './style'

// Creates the login and register pages for my application and holds helper functions for logging in with firebase
class AuthScreen extends Component {

    intialState = {

        name: ''
    }

    state = {
        loading: false,
        authMode: 'login',
        name: '',
        username: '',
        password: '',
        comfirmPassword: '',
    }

    /* Handles when a user wants to login in, logs them in using firebase. */
    loginPress = () => {

        const { username, password } = this.state;
        let res = login(username, password)
    }

    /* Handles when a user wants to register, registers them using firebase. */
    registerPress = () => {
        const { name, username, password, comfirmPassword } = this.state;

        let res = register(name, username, password, comfirmPassword)

    }

    /* Methods that update the page when imformation from firestore is updated, or they are called */
    componentDidMount() {
        this.setState({ loading: true })
        subscribeToAuthChanges(this.onAuthStateChanged)
    }

    // Moves the user to home page when the login is successful.
    onAuthStateChanged = (user) => {
        if (user !== null) {
            this.setState({ loading: false })
            this.props.navigation.navigate('App');
        }
        else {
            this.setState({ loading: false })
            this.props.navigation.navigate('Auth')
        }

    }

    // Allows the screen to change between register and login mode.
    switchAuthMode = () => {
        this.setState(prevState => ({
            authMode: prevState.authMode === 'login' ? 'register' : 'login'
        }));
    }

    render() {
        /* Shows loading graphic when page is loading. */
        if (this.state.loading) {
            return (
                <Loader></Loader>
            )
        }
        return (

            // Only renders comfirm password and name if the user is in register mode. 
            <View style={loginStyles.container}>

                <Text style={generalStyles.title}>PlanTo: {this.state.authMode}</Text>
                <View style={generalStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

                {this.state.authMode === 'register' ? (
                    <CustomTextInput placeholder="Full Name" onChangeText={(text) => this.setState({ name: text })} />

                ) : <>
                    </>}
                <CustomTextInput placeholder="Username" onChangeText={(text) => this.setState({ username: text })} />
                <CustomTextInput placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.setState({ password: text })} />
                {this.state.authMode === 'register' ? (
                    <CustomTextInput placeholder="Comfirm Passowrd" secureTextEntry={true} onChangeText={(text) => this.setState({ comfirmPassword: text })} />

                ) : <>
                    </>}

                <AppButton title={this.state.authMode} onPress={this.state.authMode === 'login' ? this.loginPress : this.registerPress} />

                <Text style={{ color: 'blue' }} onPress={this.switchAuthMode}>
                    {this.state.authMode === 'login' ? 'New to PlanTo?' : 'Already have an account?'} {this.state.authMode === 'login' ? 'Register' : 'Login'} here.
                    </Text>


            </View>
        )
    }
}


export default AuthScreen;