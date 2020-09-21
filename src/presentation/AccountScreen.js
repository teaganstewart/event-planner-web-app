/* Imports react-native components*/
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import Loader from '../business/Loader';

import { subscribeToAuthChanges, logoutUser } from '../business/FirebaseSetup'
import * as firebase from 'firebase'

import { accountStyles, mainStyles } from './style'

/*The Account page which stores user information, and allows users to logout. Was originally going
to also store the users friends list*/
class AccountScreen extends Component {

    state = {
        user: null,
        name: ''
    }

    /* Methods that update the page when imformation from firestore is updated, or they are called */
    componentDidMount() {
        subscribeToAuthChanges(this.onAuthStateChanged)

    }

    /* Makes sure that the user is logged out when they click log out, and also gets the users 
    information, including name. */
    onAuthStateChanged = (user) => {
        if (user === null) {
            this.props.navigation.navigate('Auth');
        }
        else {
            const uid = user.uid
            const usersRef = firebase.firestore().collection('users')
            usersRef
                .doc(uid)
                .get()
                .then(firestoreDocument => {
                    const user = firestoreDocument.data()
                    this.setState({ user: user, name: user.name })
                });
        }
    }

    // Function that logs out the user using Firebase.
    logoutPress = () => {
        this.setState({ user: null })
        let res = logoutUser();
    }

    render() {
        /* Shows loading graphic when page is loading. */
        if (this.state.user === null) {
            return (
                <Loader />
            )
        }
        return (
            <View style={mainStyles.container}>
                <View style={mainStyles.header}>
                    <TouchableHighlight style={mainStyles.backButton} onPress={() => { this.props.navigation.navigate("Home", { token: 'refresh' }) }}>
                        <View>
                            <Ionicons name={"ios-arrow-back"} size={25} color={"#black"} />
                        </View>
                    </TouchableHighlight>
                    <Text style={mainStyles.title}>Account</Text>

                    <TouchableOpacity onPress={this.logoutPress}>
                        <Text style={accountStyles.button}> Logout </Text>
                    </TouchableOpacity>
                </View>

                <View style={mainStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                {/* Unique for each user, displays their name */}
                <Text> Welcome {this.state.name}!</Text>
            </View>
        )
    }
}

export default AccountScreen;