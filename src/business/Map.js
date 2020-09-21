import React, { Component } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { InteractiveMap, Marker, NavigationControl } from 'react-map-gl';

class MapComponent extends Component {

    state = {
        viewport: {
            width: '80%',
            height: 300,
            latitude: -41.2769,
            longitude: 174.7731,
            zoom: 8
        },
        latitude: '',
        longitude: ''
    };

    render() {
        return (
            <InteractiveMap
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({ viewport })}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxApiAccessToken={'pk.eyJ1IjoidGVhZ2FjaHUiLCJhIjoiY2tmYzVldGRrMTh6MjJxbzNzdXpkbGM5NiJ9.SXX75Zg7UlaLZLHDz4ITUQ'}
                doubleClickZoom={false}
                minZoom={6}
                maxZoom={17}
                onDblClick={(e) => {
                    this.setState({
                        latitude: Number(e.lngLat.pop()),
                        longitude: Number(e.lngLat.pop())
                    })
                }}>

                <div style={{ position: 'absolute', top: 10, left: 10, opacity: 0.2 }}>
                    <NavigationControl showCompass={true} showZoom={true} />
                </div>

                {this.state.latitude != '' && this.state.longitude != '' ? (

                    <Marker latitude={this.state.latitude} longitude={this.state.longitude} offsetLeft={-20} offsetTop={-15}>
                        <Ionicons name={"ios-locate"} size={30} color={"white"} />
                    </Marker>

                ) :
                    <> </>
                }


            </InteractiveMap>
        )
    }
}

export default MapComponent;