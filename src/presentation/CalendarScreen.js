import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import CalendarComponent from '../business/CalendarComponent';
import { EventObject } from '../data/EventObject'
import Loader from '../business/Loader';

import * as firebase from 'firebase'
import { subscribeToAuthChanges } from '../business/FirebaseSetup'

import { mainStyles, calendarStyles } from './style'

// A class that stores the calendar components and displays users events in a nice calendar form.
class CalendarScreen extends Component {

    state = {
        events: new Map(),
        loading: true
    }

    /* Methods that update the page when imformation from firestore is updated, or they are called */
    componentDidMount() {
        subscribeToAuthChanges(this.onAuthStateChanged)

    }

    // When the page is loaded, fetches the events from firebase and adds them to the calendar.
    onAuthStateChanged = (user) => {
        if (user === null) {
            this.props.navigation.navigate('Auth');
        }
        else {
            // Adds the events to a map 
            let list = new Map()

            const uid = user.uid

            // Gets user events from firebase.
            const eventsRef = firebase.firestore().collection("users").doc(uid).collection("events")
            eventsRef.get().then((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {

                    let date = doc.get("date")

                    let e = new EventObject(
                        doc.get("id"),
                        doc.get("dayEvents"),
                        doc.get("date"),
                        doc.get("location"),
                        doc.get("startHour"),
                        doc.get("startMinutes"),
                        doc.get("endHour"),
                        doc.get("endMinutes"),
                        doc.get("latitude"),
                        doc.get("longitude")
                    );

                    // Stores user events in a map.
                    if (list.get(date) === undefined) {
                        let newList = []
                        newList.push(e)
                        list.set(date, newList)
                    }
                    else {
                        let newList = list.get(date)
                        newList.push(e)
                        list.set(date, newList)
                    }
                })

                this.setState({ events: list, loading: false })
            });
        }
    }

    // Allows the page to recieve props from other pages then refreshes the page.
    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params.token) {
            this.setState({ loading: true })
            this.componentDidMount();
        }
    }

    render() {

        /* Shows loading graphic when page is loading. */
        if (this.state.loading) {
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
                    <Text style={mainStyles.title}>Calendar</Text>
                </View>

                <View style={mainStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

                <View style={calendarStyles.calendarView}>
                    <CalendarComponent events={this.state.events} navigation={this.props.navigation} />
                </View>
            </View>

        )
    }
}

export default CalendarScreen;