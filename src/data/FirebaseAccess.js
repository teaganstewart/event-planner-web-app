import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

// A funciton to create a new user and add them to the database.
export async function registerUser(name, email, password) {

    try {
        // Adds the new user to the firebase database.
        let res = await firebase.auth().createUserWithEmailAndPassword(email, password)
        return res;
    }
    catch (error) {

        return undefined;
    }
}

/* checks that the given email and password exists in the firebase database 
    email: the given email
    password: the given password
*/
export async function authenticate(email, password) {
    // where the authentication happens, checks if user is in the database.

    try {
        // checks with firebase.
        const res = await firebase.auth().signInWithEmailAndPassword(email, password)
        return res;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// Sets the users details in firestore, so they can be accessed later.
export async function setUserDetails(res, email, name) {
    res.then((response) => {
        if (response != null && response.user != null) {
            const uid = response.user.uid

            const data = {
                id: uid,
                email,
                name,
            };

            const usersRef = firebase.firestore().collection('users')
            usersRef.doc(uid).set(data).then(() => {
                return res;
            }).catch((error) => {
                alert(error)
            })

        }
    })
}

// Adds a users events to storage so they can be accessed later.
export async function addEventToStorage(eid, selectedDay, eventName, loc, sHours, sMinutes, eHours, eMinutes, lat, long) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const eventsDb = firebase.firestore().collection("users").doc(user.uid).collection("events")

            eventsDb.doc(eid).set({
                id: eid,
                date: selectedDay,
                dayEvents: eventName,
                location: loc,
                startHour: sHours,
                startMinutes: sMinutes,
                endHour: eHours,
                endMinutes: eMinutes,
                latitude: lat,
                longitude: long
            });

        } else {
            return null;
        }
    });
}

// Deletes a users event from storage using its unique id.
export async function deleteEventFromStorage(id) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const eventsDb = firebase.firestore().collection("users").doc(user.uid).collection("events")
            eventsDb.doc(id).delete().then(function () {
                console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
        } else {
            return null;
        }
    });
}
