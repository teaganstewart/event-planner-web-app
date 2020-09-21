/* Imports for firebase access/ setup */
import * as firebase from 'firebase'
import { registerUser, setUserDetails } from '../data/FirebaseAccess';

var firebaseConfig = {
    apiKey: "AIzaSyDfHY-qJMaonUdnxws4q7K-o1o-UsEa-1Y",
    authDomain: "swen325-a2.firebaseapp.com",
    databaseURL: "https://swen325-a2.firebaseio.com",
    projectId: "swen325-a2",
    storageBucket: "swen325-a2.appspot.com",
    messagingSenderId: "399336641894",
    appId: "1:399336641894:web:0d6d550a01b1e70e5ba4a7",
    measurementId: "G-NVZ4T8FZ2M"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

/* checks that the given username and password exists in the firebase database 
    usernmae: the given username
    password: the given password
*/
export async function login(username, password) {
    let email = username + "@planto.com"

    if (password === "" || username === "") {
        alert("Username and password cannot be empty!")
        return undefined;
    }

    // Checks firebase and returns the data to the main screen. 
    let res = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
            const uid = response.user.uid
            const usersRef = firebase.firestore().collection('users')
            usersRef
                .doc(uid)
                .get()
                .then(firestoreDocument => {
                    if (!firestoreDocument.exists) {
                        alert("User does not exist.")
                        return;
                    }
                    const user = firestoreDocument.data()
                    return { user };
                })
                .catch(error => {
                    alert(error)
                });
        })
        .catch(error => {
            alert(error)
        })
}

/* A funciton to create a new user and add them to the database. */
export function register(name, username, password, comfirmPassword) {

    let email = username + "@planto.com"

    if (comfirmPassword != password) {
        alert("Passwords don't match!")
        return undefined;
    }

    if (password === "" || username === "" || name === "") {
        alert("Name, username and password cannot be empty!")
        return undefined;
    }

    // Registers the user through firebase, if it is sucessful, stores the users data.
    let res = registerUser(name, email, password)
    setUserDetails(res, email, name).catch((error) => {
        alert(error)
    })

    return res;

}

// Returns the current user.
export function subscribeToAuthChanges(authStateChanged) {
    firebase.auth().onAuthStateChanged((user) => {
        authStateChanged(user);
    })
}

// A function to sign out the user, resets user state of the application.
export function logoutUser() {
    let res = firebase.auth().signOut();
    return undefined;
}

export default { login, register, subscribeToAuthChanges }