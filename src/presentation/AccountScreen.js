import React, { Component } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, TouchableHighlight} from 'react-native'

import { subscribeToAuthChanges, logoutUser } from '../business/FirebaseSetup'
import * as firebase from 'firebase'

import { accountStyles, mainStyles, generalStyles } from './style'
import Loader from '../business/Loader';

class AccountScreen extends Component {

    state = {
        user: null,
        name: ''
    }

    componentDidMount() {
        subscribeToAuthChanges(this.onAuthStateChanged)

    }

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

    logoutPress = () => {
        this.setState({ user: null })
        let res = logoutUser();

    }

    render() {
        if (this.state.user === null) {
            return (
                <Loader />
            )
        }
        return (
            <View style={mainStyles.container}>
                <View style={mainStyles.header}>
                    <TouchableHighlight  style={mainStyles.backButton} onPress={() => { this.props.navigation.navigate("Home", { token: 'refresh' })}}>
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
                <Text> Welcome {this.state.name}!</Text>
            </View>
        )
    }
}

export default AccountScreen;