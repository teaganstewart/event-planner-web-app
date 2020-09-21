import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'modal-react-native-web'
import { ModalButton, ModalTextInput, AppButton } from './MainComponents'
import moment from 'moment';

import { Ionicons } from '@expo/vector-icons';
import { InteractiveMap, Marker, NavigationControl } from 'react-map-gl';
import { EventObject } from '../data/EventObject'
import TimePicker from 'react-native-simple-time-picker';

import { Card } from 'react-native-paper'
import { FlatList, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { addEventToStorage, deleteEventFromStorage } from '../data/FirebaseAccess';

import * as firebase from 'firebase'
import { subscribeToAuthChanges } from '../business/FirebaseSetup'

import { calendarStyles, homeStyles } from '../presentation/style'


const purple = { key: 'purple', color: '#ab54a0', };
const blue = { key: 'blue', color: '#1dbdcc', };
const red = { key: 'red', color: '#e01b4c' };

const _format = 'YYYY-MM-DD';
const _today = moment(new Date().dateString).format(_format);

export default class CalendarComponent extends React.Component {

  initialState = {
    [_today]: { disabled: false },
  };

  state = {
    isMap: false,
    isEditing: false,
    loading: false,
    eventName: '',
    location: '',
    startHours: '0',
    startMinutes: '0',
    endHours: '0',
    endMinutes: '0',
    _markedDates: this.getMarkedDates(),
    isOpen: false,
    isAddOpen: false,
    isEditOpen: false,
    selectedDay: '',
    selectedEvent: '',
    events: this.props.events,
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


  componentDidMount = () => {
    subscribeToAuthChanges(this.onAuthStateChanged)
  }

  onAuthStateChanged = (user) => {
    if (user === null) {
      this.props.navigation.navigate('Auth');
    }
    else {
      this.state.loading = true;
      if (this.state.selectedEvent != '') {
        deleteEventFromStorage(this.state.selectedEvent.getId())
        const eventsRef = firebase.firestore().collection("users").doc(user.uid).collection("events")
        while (eventsRef.doc(this.state.selectedEvent.getId()) === undefined) {
          // makes sure that the event is deleted before refreshing
        }
      }

      this.state.loading = false;
      this.setState({ selectedDay: '', selectedEvent: '', _markedDates: this.getMarkedDates() })
    }
  }


  getMarkedDates() {
    let markedEvents = {};
    let events = this.props.events;
    let uniqueDates = []; //remove duplicate event dates
    let selected = true;

    for (const [key, value] of events.entries()) {
      uniqueDates.push(key)
    }

    uniqueDates.forEach(function (date) {
      let dots = [];
      let markedData = {};

      //marks the selected date
      if (events.get(date).length >= 1) dots.push(purple);
      if (events.get(date).length >= 2) dots.push(blue);
      if (events.get(date).length >= 3) dots.push(red);

      if (dots.length == 0) selected = false;

      markedData['dots'] = dots; //set the array of dots
      markedData['selected'] = selected
      markedEvents[date] = markedData; //add markers to marked dates
    });

    return markedEvents;

  }

  onDaySelect = day => {
    const _selectedDay = moment(day.dateString).format(_format);

    this.setState({
      selectedDay: _selectedDay,
      isOpen: true,
      eventName: '',
      location: '',
      selectedEvent: '',
    });

  };

  variableCheck = () => {
    const { eventName, startHours, startMinutes, endHours, endMinutes } = this.state;

    if (endHours === 24 || startHours === 24) {
      alert("Events can only stay on the current date! Sorry!")
    }

    if (eventName === '') {
      alert("You can't have an empty event name!")
      return false;
    }

    if (endHours < startHours && endHours.length === startHours.length) {
      alert('The end time cannot be before the start time!')
      return false;
    }

    if (endHours < startHours && endHours.length < startHours.length) {
      alert('The end time cannot be before the start time!')
      return false;
    }

    if (endHours === startHours && (endMinutes <= startMinutes || endMinutes.length < startMinutes.length)) {
      alert('The end time cannot be before or the same as the start time!')
      return false;
    }

    return true;
  }

  // Creates a random id
  randomId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  saveDay = () => {
    let dots = [];
    let selected = true;

    const { _markedDates, latitude, longitude, selectedDay, events, eventName, location, startHours, startMinutes, endHours, endMinutes } = this.state;

    if (latitude === '' || longitude === '') {
      alert("You have to choose a location!")
      return
    }

    let id = this.randomId();

    let e = new EventObject(
      id,
      eventName,
      selectedDay,
      location,
      startHours,
      startMinutes,
      endHours,
      endMinutes,
      latitude,
      longitude
    );

    // Adds the events to a map 
    let list = events;
    if (list.get(selectedDay) === undefined) {
      let newList = []
      newList.push(e)
      list.set(selectedDay, newList)
    }
    else {
      let newList = list.get(selectedDay)
      newList.push(e)
      list.set(selectedDay, newList)
    }

    this.setState({ events: list })

    addEventToStorage(id, selectedDay, eventName, location, startHours, startMinutes, endHours, endMinutes, latitude, longitude)

    // adds dots to the calendar to represent the number of events (3 or more is just 3 dots)
    if (events.get(date).length >= 1) dots.push(purple);
    if (events.get(date).length >= 2) dots.push(blue);
    if (events.get(date).length >= 3) dots.push(red);


    if (events.length == 0) selected = false;
    else selected = true;

    const clone = { ..._markedDates };
    clone[selectedDay] = { dots, selected };

    this.setState({ _markedDates: clone, eventName: '', location: '', isMap: false });

  };

  chooseLocation = () => {

    let res = this.variableCheck()

    if (res === false) {
      return
    }

    this.setState({ isAddOpen: false, isMap: true })
  }

  setupEdit = () => {
    let currEvent = this.state.selectedEvent;
    this.setState({
      eventName: currEvent.getName(), location: currEvent.getLocation()
    })
    this.setState({ isEditing: true, isAddOpen: true, isEditOpen: false })
  }

  editLocation = () => {

    let res = this.variableCheck()

    if (res === false) {
      return
    }

    const { selectedEvent } = this.state
    let lat = selectedEvent.getLatitude()
    let long = selectedEvent.getLongitude()

    this.setState({ latitude: lat, longitude: long })
    this.setState({ isAddOpen: true, isMap: true })
  }

  editEvent = () => {


    const { selectedEvent, selectedDay, events, eventName, location, startHours, startMinutes, endHours, endMinutes, latitude, longitude } = this.state;

    if (latitude === '' || longitude === '') {
      alert("You have to choose a location!")
      return
    }

    let date = selectedEvent.getDate()

    let e = new EventObject(
      selectedEvent.getId(),
      eventName,
      date,
      location,
      startHours,
      startMinutes,
      endHours,
      endMinutes,
      latitude,
      longitude
    );

    let eventList = events.get(date)
    eventList.pop(selectedEvent);
    eventList.push(e);
    events.set(date, eventList)

    addEventToStorage(selectedEvent.getId(), selectedDay, eventName, location, startHours, startMinutes, endHours, endMinutes, latitude, longitude)
    this.setState({ isEditing: false, isMap: false, isAddOpen: false, isEditOpen: false })
  }

  deleteEvent = () => {
    const { selectedEvent, events } = this.state;
    let date = selectedEvent.getDate()

    let eventList = events.get(date)
    eventList.pop(selectedEvent);
    events.set(date, eventList)

    this.setState({ isEditOpen: false })
    this.componentDidMount()
  }

  onCardPress = (item) => {
    this.setState({ selectedEvent: item })
  }

  render() {
    const AddButton = () => (
      <ModalButton
        title="Add Event"
        onPress={this.saveDay}
        style={[calendarStyles.modalButton]}
      />
    );

    const LocationButton = () => (
      <ModalButton
        title="Go to Choose Map Location"
        onPress={this.chooseLocation}
        style={[calendarStyles.modalButton]}
      />
    );

    const CloseButton = () => (
      <ModalButton
        title="Close"
        onPress={() => this.setState({ isAddOpen: false, isEditing: false })}
        style={[calendarStyles.modalButton]}
      />
    );

    const EditButton = () => {
      return (
        <View>
          {this.state.selectedEvent != '' ? (
            <ModalButton
              title={"Edit: " + this.state.selectedEvent.getName()}
              onPress={this.setupEdit}
              style={[calendarStyles.modalButton]}
            />
          ) : <>
            </>
          }
        </View>
      )
    }

    const EditLocationButton = () => {
      return (

        <ModalButton
          title={"Edit"}
          onPress={this.editLocation}
          style={[calendarStyles.modalButton]}
        />

      )
    }


    const EditFinalButton = () => {
      return (

        <ModalButton
          title={"Choose Location"}
          onPress={this.editEvent}
          style={[calendarStyles.modalButton]}
        />

      )
    }

    const DeleteButton = () => {
      return (
        <View>
          {this.state.selectedEvent != '' ? (
            <ModalButton
              title={"Delete: " + this.state.selectedEvent.getName()}
              onPress={this.deleteEvent}
              style={[calendarStyles.modalButton]}
            />
          ) : <>
            </>
          }
        </View>
      )
    }

    const CloseEditButton = () => {
      return (
        <ModalButton
          title="Close"
          onPress={() => this.setState({ isEditOpen: false })}
          style={[calendarStyles.modalButton]}
        />
      )
    }

    const CloseMainModalButton = () => (
      <ModalButton
        title="Close"
        onPress={() => this.setState({ isOpen: false })}
        style={[calendarStyles.modalButton]}
      />
    );


    const OpenAddButton = () => {
      return (
        <ModalButton
          title="Add Event"
          onPress={() => this.setState({ isOpen: false, isAddOpen: true })}
          style={[calendarStyles.modalButton]}
        />
      )
    }

    const OpenEditButton = () => {
      return (
        <View>

          {this.state.events.get(this.state.selectedDay) != undefined && this.state.events.get(this.state.selectedDay).length != 0 ? (
            <ModalButton

              title="Edit/Delete Event"
              onPress={() => this.setState({ isOpen: false, isEditOpen: true })}
              style={[calendarStyles.modalButton]}
            />
          ) : <> </>
          }
        </View>
      )
    }

    if (this.state.loading) {
      return (<Loader></Loader>)
    }

    if (this.state.isMap) {
      return (
        <View style={calendarStyles.mapBackground}>
          <View style={calendarStyles.mapView}>
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

            <View style={calendarStyles.mapButton}>
              {this.state.isEditing ? (
                <EditFinalButton />

              )
                :
                <AddButton />
              }

            </View>
          </View>
        </View>
      )
    }

    return (

      <View >
        <Calendar
          renderArrow={(direction) => {
            if (direction == "left")
              return (
                <Text> Previous </Text>
              );
            if (direction == "right")
              return (
                <Text> Next </Text>
              );
          }}
          markedDates={this.state._markedDates
          }
          calendarWidth={920}

          markingType={'multi-dot'}
          onDayPress={this.onDaySelect}
          theme={{
            selectedDayBackgroundColor: '#fae1f7',
            selectedDayTextColor: '000000',
            textMonthFontWeight: 'normal',
            todayTextColor: '#000000',
            textMonthFontSize: 18,
          }
          }
        />

        <Modal
          style={calendarStyles.modal}
          visible={this.state.isOpen}
          isDisabled={this.state.isDisabled}
        >

          <View style={calendarStyles.mainModal}>
            <OpenAddButton />
            <OpenEditButton />
            <CloseMainModalButton />
          </View>

        </Modal>


        <Modal
          style={calendarStyles.modal}

          visible={this.state.isAddOpen}
          isDisabled={this.state.isDisabled}
        >

          {this.state.isEditing ? (
            <Text style={calendarStyles.titleText}>Edit Event: {this.state.selectedEvent.getName()} </Text>

          )
            :
            <Text style={calendarStyles.titleText}>Add Event </Text>
          }

          <ModalTextInput placeholder="Event Name" value={this.state.eventName} onChangeText={(text) => this.setState({ eventName: text })} />
          <ModalTextInput placeholder="Location" value={this.state.location} onChangeText={(text) => this.setState({ location: text })} />

          {this.state.isEditing ? (
            <Text style={calendarStyles.editText}>  {"The event time is currently: " + this.state.selectedEvent.getStartHour() + ":" + this.state.selectedEvent.getStartMinutes() + " - " + this.state.selectedEvent.getEndHour() + ":" + this.state.selectedEvent.getEndMinutes()}</Text>

          )
            :
            <> </>
          }

          <Text style={calendarStyles.timeText}> Start Time </Text>
          <View style={calendarStyles.timePicker}>
            <TimePicker
              selectedHours={this.state.startHours}
              selectedMinutes={this.state.startMinutes}
              onChange={(hours, minutes) => this.setState({
                startHours: hours, startMinutes: minutes
              })}
            />
          </View>

          <Text style={calendarStyles.timeText}> End Time </Text>
          <View style={calendarStyles.timePicker}>
            <TimePicker
              selectedHours={this.state.endHours}
              selectedMinutes={this.state.endMinutes}
              onChange={(hours, minutes) => this.setState({
                endHours: hours, endMinutes: minutes
              })}
            />
          </View>

          {this.state.isEditing ? (
            <EditLocationButton />

          )
            :
            <LocationButton />
          }

          <CloseButton />
        </Modal>


        {/* The modal that allows you to delete or edit an event. */}
        <Modal
          style={calendarStyles.modal}
          visible={this.state.isEditOpen}
          isDisabled={this.state.isDisabled}
        >
          <View style={calendarStyles.editModal}>
            <Text style={calendarStyles.titleText}> Edit Event </Text>
            <Text style={calendarStyles.editText}> Select an event from below to edit! </Text>
            <ScrollView style={calendarStyles.modalListView}>
              <FlatList
                data={this.state.events.get(this.state.selectedDay)}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={() => this.onCardPress(item)}>

                    <Card style={calendarStyles.listCard}>
                      <View>
                        <Text style={homeStyles.cardDate}> {item.getName()} </Text>
                        <Text> {"Location: " + item.getLocation() + " (" + (item.getLatitude()).toFixed(4) + ", " + item.getLongitude().toFixed(4) + ")"} </Text>
                        <Text style={homeStyles.cardDate}> {item.getStartHour() + ":" + item.getStartMinutes() + " - " + item.getEndHour() + ":" + item.getEndMinutes()}</Text>
                      </View>
                    </Card>

                  </TouchableOpacity>
                }
              >

              </FlatList>
            </ScrollView>

            <EditButton />
            <DeleteButton />
            <CloseEditButton />
          </View>
        </Modal>

      </View>
    );
  }
}