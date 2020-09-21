import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'
import Popover, { Rect } from 'react-native-popover-view';

import { Ionicons } from '@expo/vector-icons';
import { InteractiveMap, Marker, NavigationControl } from 'react-map-gl';
import { EventObject } from '../data/EventObject'
import Loader from '../business/Loader';

import * as firebase from 'firebase'
import { subscribeToAuthChanges } from '../business/FirebaseSetup'

import { mainStyles, mapStyles } from '../presentation/style'

class MapScreen extends Component {

    state = {
        popupVisible: false,
        loading: true,
        events: [],
        viewport: {
            width: '100%',
            height: '100%',
            latitude: -41.2769,
            longitude: 174.7731,
            zoom: 4
        },
    }

    componentDidMount() {
        subscribeToAuthChanges(this.onAuthStateChanged)
    }

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

    onPress = (event) => {
        alert(event)
    }

    render() {
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