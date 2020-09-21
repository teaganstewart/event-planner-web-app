/* Imports react-native components*/
import React from 'react';
import { View, Text } from 'react-native';
import { FlatList, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';

/* Imports external components */
import TimePicker from 'react-native-simple-time-picker';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import Modal from 'modal-react-native-web'
import { Card } from 'react-native-paper'
import { InteractiveMap, Marker, NavigationControl } from 'react-map-gl';

/* Imports other components I have written */
import { ModalButton, ModalTextInput } from './MainComponents'
import { EventObject } from '../data/EventObject'

/* Imports for firebase access/ setup */
import * as firebase from 'firebase'
import { subscribeToAuthChanges } from '../business/FirebaseSetup'
import { addEventToStorage, deleteEventFromStorage } from '../data/FirebaseAccess';

import { calendarStyles, homeStyles } from '../presentation/style'
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';

/* Creates the colours for the dots that represent events on the calendar*/
const purple = { key: 'purple', color: '#ab54a0', };
const blue = { key: 'blue', color: '#1dbdcc', };
const red = { key: 'red', color: '#e01b4c' };

/* Sets the date format for the calendar*/
const _format = 'YYYY-MM-DD';
const _today = moment(new Date().dateString).format(_format);

/* Creates the calendar component on the Calendar Screen. Also provides all the modal popups for 
deleting/ editing of events. */
export default class CalendarComponent extends React.Component {

  initialState = {
    [_today]: { disabled: false },
  };

  /*The initial state when the page loads, sets all default variables for the events, 
  maps and modal visibility */
  state = {
    isMap: false, //display of map
    isEditing: false, // whether user is editing an event or not
    loading: false,
    isOpen: false, //display of main modal
    isAddOpen: false, //display of add event modal
    isEditOpen: false, //display of edit event modal
    eventName: '',
    location: '',
    startHours: '0',
    startMinutes: '0',
    endHours: '0',
    endMinutes: '0',
    _markedDates: this.getMarkedDates(),
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

  /* Methods that update the page when imformation from firestore is updated, or they are called */
  componentDidMount = () => {
    subscribeToAuthChanges(this.onAuthStateChanged)
  }

  /* Uses the current user to either return to AuthScreen, or loads current users events. */
  onAuthStateChanged = (user) => {
    if (user === null) {
      this.props.navigation.navigate('Auth');
    }
    else {
      // this method is only called when a selected event is to be deleted and on initialisation
      this.state.loading = true;
      // catches initialisation
      if (this.state.selectedEvent != '') {
        // deletes selected event from storage
        deleteEventFromStorage(this.state.selectedEvent.getId())

        // references the current users collection of events.
        const eventsRef = firebase.firestore().collection("users").doc(user.uid).collection("events")

        while (eventsRef.doc(this.state.selectedEvent.getId()) === undefined) {
          // makes sure that the event is deleted before refreshing
        }
      }

      this.state.loading = false;

      // resets the marked dates so the calendar is displayed correctly
      this.setState({ selectedDay: '', selectedEvent: '', _markedDates: this.getMarkedDates() })
    }
  }

  /* Method that gets called on initalisation and on deletion/ creation of events. Marks the calendar
  with dots for events and highlights dates with at least one event.*/
  getMarkedDates() {
    let markedEvents = {};
    let events = this.props.events;
    let dates = [];
    let selected = true;

    // Gets the dates from the event map
    for (const [key, value] of events.entries()) {
      dates.push(key)
    }

    // Uses these events to mark the calendar
    dates.forEach(function (date) {
      let dots = [];
      let markedData = {};

      // Gets the correct amount of dots for each date. Max is 3.
      if (events.get(date).length >= 1) dots.push(purple);
      if (events.get(date).length >= 2) dots.push(blue);
      if (events.get(date).length >= 3) dots.push(red);

      if (dots.length == 0) selected = false;

      markedData['dots'] = dots; // Sets the array of dots.
      markedData['selected'] = selected // Sets whether date is highlighted or not
      markedEvents[date] = markedData; // Adds markers to marked dates
    });

    return markedEvents;

  }

  /* Method that triggers when a date is pressed on the calendar. Sets and resets the relevant 
  selected objects. */
  onDaySelect = day => {
    // Makes sure pressed date is the chosen date.
    const _selectedDay = moment(day.dateString).format(_format);

    this.setState({
      selectedDay: _selectedDay,
      isOpen: true,
      eventName: '',
      location: '',
      selectedEvent: '',
    });

  };

  /* A method that checks the entered variables for the new/ edited event are valid. There are
  weird checks as javascript was saying that numbers seperation by a 10 were bigger when they were smaller.
  e.g 12 > 9 was false when it should have been true. */
  variableCheck = () => {
    const { eventName, startHours, startMinutes, endHours, endMinutes } = this.state;

    // Due to the external component not having an option to change the numbers.
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

  // Creates a random id for the user's events. Found online.
  randomId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  /* The method that is called when the user adds a new event.*/
  saveDay = () => {
    let dots = [];
    let selected = true;

    const { _markedDates, latitude, longitude, selectedDay, events, eventName, location, startHours, startMinutes, endHours, endMinutes } = this.state;

    // Makes sure that the user has chosen a location on the map before creating the event.
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

    // Adds the event to the event map
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

    // Adds the event to firebase storage.
    addEventToStorage(id, selectedDay, eventName, location, startHours, startMinutes, endHours, endMinutes, latitude, longitude)

    // adds dots to the calendar to represent the number of events (3 or more is just 3 dots)
    if (events.get(selectedDay).length >= 1) dots.push(purple);
    if (events.get(selectedDay).length >= 2) dots.push(blue);
    if (events.get(selectedDay).length >= 3) dots.push(red);

    if (events.length == 0) selected = false;
    else selected = true;

    // updates the calendar ui, to show the new event.
    const clone = { ..._markedDates };
    clone[selectedDay] = { dots, selected };

    // closes the map view and resets the variables.
    this.setState({ _markedDates: clone, eventName: '', location: '', latitude: '', longitude: '', isMap: false });
  };

  /* A method that first checks the users input for the events variables are correct and non-empty, then
  if they are moves to the choose location view */
  chooseLocation = () => {

    let res = this.variableCheck()
    if (res === false) {
      return
    }

    this.setState({ isAddOpen: false, isMap: true })
  }

  /* Sets up the add event page for editing. First sets all the variables it can to the selected event 
  to edits variables, then moves to the edit event page.*/
  setupEdit = () => {
    let currEvent = this.state.selectedEvent;

    // keeping selected event to edits variables
    this.setState({
      eventName: currEvent.getName(), location: currEvent.getLocation()
    })

    this.setState({ isEditing: true, isAddOpen: true, isEditOpen: false })
  }

  /* Checks users input once editing event, then sets up for editing of location.*/
  editLocation = () => {

    let res = this.variableCheck()
    if (res === false) {
      return
    }

    const { selectedEvent } = this.state

    // Gets the selected events coordinates so it can be displayed on the map.
    let lat = selectedEvent.getLatitude()
    let long = selectedEvent.getLongitude()

    this.setState({ latitude: lat, longitude: long })
    this.setState({ isAddOpen: true, isMap: true })
  }

  /* Called once user changes the edited events location.*/
  editEvent = () => {
    const { selectedEvent, selectedDay, events, eventName, location, startHours, startMinutes, endHours, endMinutes, latitude, longitude } = this.state;

    // Makes sure the user chose a location.
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

    // Removes the selected event and replaces it with the updated event.
    let eventList = events.get(date)
    eventList.pop(selectedEvent);
    eventList.push(e);
    events.set(date, eventList)

    // Adds event to storage, it has the id so will overwrite old event.
    addEventToStorage(selectedEvent.getId(), selectedDay, eventName, location, startHours, startMinutes, endHours, endMinutes, latitude, longitude)
    // Closes all modals and shows the calendar.
    this.setState({ isEditing: false, isMap: false, isAddOpen: false, isEditOpen: false })
  }

  /* A method that handles the deletion of an event.*/
  deleteEvent = () => {
    const { selectedEvent, events } = this.state;
    let date = selectedEvent.getDate()

    // Removes the event from the event map
    let eventList = events.get(date)
    eventList.pop(selectedEvent);
    events.set(date, eventList)

    this.setState({ isEditOpen: false })

    // Updates the calendar screen with the new event map.
    this.componentDidMount()
  }

  /* A method that is called when a card in the list of events is picked. This event can then be deleted
  or modified */
  onCardPress = (item) => {
    this.setState({ selectedEvent: item })
  }

  render() {
    /* Button to add an event. */
    const AddButton = () => (
      <ModalButton
        title="Add Event"
        onPress={this.saveDay}
        style={[calendarStyles.modalButton]}
      />
    );

    /* When adding an event, allows the user to go to the choose location screen. */
    const LocationButton = () => (
      <ModalButton
        title="Go to Choose Map Location"
        onPress={this.chooseLocation}
        style={[calendarStyles.modalButton]}
      />
    );

    /* Closes the modal whether the user is editing or creating an event. */
    const CloseButton = () => (
      <ModalButton
        title="Close"
        onPress={() => this.setState({ isAddOpen: false, isEditing: false })}
        style={[calendarStyles.modalButton]}
      />
    );

    /* Alows the user to start editing the selected event, navigates to the edit event page. */
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

    /* Allows user to pick a new location for the selected event. */
    const EditLocationButton = () => {
      return (

        <ModalButton
          title={"Edit"}
          onPress={this.editLocation}
          style={[calendarStyles.modalButton]}
        />

      )
    }

    /* Once user has chosen new selected event's location, edits the events and adds to storage. */
    const EditFinalButton = () => {
      return (

        <ModalButton
          title={"Choose Location"}
          onPress={this.editEvent}
          style={[calendarStyles.modalButton]}
        />

      )
    }

    /* Deletes the selected event. Only shows if their is a event selected. */
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

    /* Allows the user to opt out of editing an event. */
    const CloseEditButton = () => {
      return (
        <ModalButton
          title="Close"
          onPress={() => this.setState({ isEditOpen: false })}
          style={[calendarStyles.modalButton]}
        />
      )
    }

    /* Allows the user to opt out of either adding or editing/deleting an event. */
    const CloseMainModalButton = () => (
      <ModalButton
        title="Close"
        onPress={() => this.setState({ isOpen: false })}
        style={[calendarStyles.modalButton]}
      />
    );


    /* Opens the add event menu if the user chooses to add an event. */
    const OpenAddButton = () => {
      return (
        <ModalButton
          title="Add Event"
          onPress={() => this.setState({ isOpen: false, isAddOpen: true })}
          style={[calendarStyles.modalButton]}
        />
      )
    }

    /* Opens the edit/delete event meny if the user chooses to edit or delete and event. Only displays
    if the selected day has any events. */
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

    /* Shows loading graphic when page is loading. */
    if (this.state.loading) {
      return (<Loader></Loader>)
    }

    /* Returns map view when isMap is true */
    if (this.state.isMap) {
      return (
        <View style={calendarStyles.mapBackground}>
          <View style={calendarStyles.mapView}>
            {/* A map that can be interaction with using the mapbox API.  */}
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

              {/* Allows control of the zoom for easy navigation.  */}
              <div style={{ position: 'absolute', top: 10, left: 10, opacity: 0.2 }}>
                <NavigationControl showCompass={true} showZoom={true} />
              </div>

              {/* Adds markers on the map for each of the users events. */}
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
          markedDates={this.state._markedDates}
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

        {/* The main modal, giving the user the option to add, delete or update events.  */}
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

        {/* The add event modal. Also functions as the edit event modal when isEditing is true.  */}
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
          <ModalTextInput placeholder="Location (optional)" value={this.state.location} onChangeText={(text) => this.setState({ location: text })} />

          {this.state.isEditing ? (
            <Text style={calendarStyles.editText}>  {"The event time is currently: " + this.state.selectedEvent.getStartHour() + ":" + this.state.selectedEvent.getStartMinutes() + " - " + this.state.selectedEvent.getEndHour() + ":" + this.state.selectedEvent.getEndMinutes()}</Text>

          )
            :
            <> </>
          }

          {/* Creates hour and minute pickers for the time. */}
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

              {/* Displays all events in a list, so events can be clicked on to be selected for editing/ deleting.  */}
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