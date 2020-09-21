import React, { Component } from 'react';
import { View, Text } from 'react-native'

import { TouchableHighlight } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { InteractiveMap, Marker, NavigationControl } from 'react-map-gl';

import { EventObject } from '../data/EventObject'
import Loader from '../business/Loader';

import * as firebase from 'firebase'
import { subscribeToAuthChanges } from '../business/FirebaseSetup'

import { mainStyles, mapStyles } from '../presentation/style'

// A class that displays all the users events on an easy to view map, displaying the locations.
class MapScreen extends Component {

    state = {
        popupVisible: false,
        loading: true,
        events: [],
        // Renders the starting point of the map.
        viewport: {
            width: '100%',
            height: '100%',
            latitude: -41.2769,
            longitude: 174.7731,
            zoom: 4
        },
    }

    /* Methods that update the page when imformation from firestore is updated, or they are called */
    componentDidMount() {
        subscribeToAuthChanges(this.onAuthStateChanged)
    }

    // Gets all the users events so they can be displayed on the map.
    onAuthStateChanged = (user) => {
        if (user === null) {
            this.props.navigation.navigate('Auth');
        }
        else {
            let uEvents = [];

            const uid = user.uid
            const eventsRef = firebase.firestore().collection("users").doc(uid).collection("events")
            eventsRef.get().then((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
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

                    uEvents.push(e)

                })

                this.setState({ events: uEvents, loading: false })
            });
        }
    }

    // Renders an alert when an event marked is pressed.
    onPress = (event) => {
        alert(event)
    }

    render() {

        /* Shows loading graphic when page is loading. */
        if (this.state.loading) {
            return (
                <Loader />
            )
        }
        return (
            <View style={mapStyles.container}>

                <View style={mainStyles.header}>
                    <TouchableHighlight style={mainStyles.backButton} onPress={() => { this.props.navigation.navigate("Home", { token: 'refresh' }) }}>
                        <View>
                            <Ionicons name={"ios-arrow-back"} size={25} color={"#black"} />
                        </View>
                    </TouchableHighlight>
                    <Text style={mainStyles.title}>Map</Text>
                </View>

                {/* Implements my API mapbox and allows the events to be viewed in a different format. */}
                <InteractiveMap
                    {...this.state.viewport}
                    onViewportChange={(viewport) => this.setState({ viewport })}
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    mapboxApiAccessToken={'pk.eyJ1IjoidGVhZ2FjaHUiLCJhIjoiY2tmYzVldGRrMTh6MjJxbzNzdXpkbGM5NiJ9.SXX75Zg7UlaLZLHDz4ITUQ'}
                    doubleClickZoom={false}
                    minZoom={4}
                    maxZoom={17}
                >

                    <div style={{ position: 'absolute', top: 10, left: 10, opacity: 0.2 }}>
                        <NavigationControl showCompass={true} showZoom={true} />
                    </div>

                    {/* Adds the events to the map in the form of markers.  */}
                    {this.state.events.map(e =>
                        <Marker latitude={e.getLatitude()} longitude={e.getLongitude()} offsetLeft={-20} offsetTop={-15} onPress>
                            <Ionicons onClick={() => this.onPress(e)} name={"ios-locate"} size={30} color={"white"} style={{ opacity: 0.5 }} />
                        </Marker>

                    )}

                </InteractiveMap>
            </View >
        )
    }
}

export default MapScreen;