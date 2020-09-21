
import { StyleSheet } from 'react-native';
 
// Sets the general deafult style that crosses all pages.
export const generalStyles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontFamily: 'bebas-neue'
    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: '90%',
    },

});

// Sets the deafult style for the main pages.
export const mainStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 26,
        paddingBottom: 10,
        
    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: '90%',
    },
    header: {
        width: "100%",
        paddingHorizontal: "4%",
        paddingBottom: 20,
        borderBottomWidth:2,
        borderBottomColor: 'black'
    },
    title: {
        fontSize: 30,
        fontFamily: 'bebas-neue',
        marginLeft: 28,
        marginTop: -32,
    },
    backButton: {
        width: 20
    }
});

// Sets the default style for the login and registeration pages.
export const loginStyles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 80

    },
    button: {
        fontSize: 20,
        backgroundColor: "pink",
        borderColor: "black",
        borderWidth: 2,
        marginVertical: 30,
        paddingVertical: 6,
        paddingHorizontal: 10,
        width: 300,
        textAlign: "center",
        fontFamily: 'bebas-neue'
    }, 
    textInput: {
        borderColor: '#000000', 
        borderBottomWidth: 2,
        width: 300,
        height: 40,
        marginTop: 20,
        paddingHorizontal: 5,
    },
    link: {
        color: "#78c18c",
        fontWeight: "bold"
    }
});

// Sets the default style for the account page.
export const accountStyles = StyleSheet.create({
    button: {
        fontSize: 14,
        marginLeft: 20,
        backgroundColor: "pink",
        position: "absolute",
        paddingVertical: 6,
        paddingHorizontal: 10,
        right: 0,
        top: -32,
        borderColor: "black",
        borderWidth: 2,
    },
});

// Sets the default style for the home page.
export const homeStyles = StyleSheet.create({
    listCard: {
        width: '98%',
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
        marginBottom: 20,
    },
    listView: {
        paddingTop: 20,
        width: '94%',
        borderWidth: 1,
        borderColor: 'black',
        paddingLeft: '1.7%',
        marginTop: 10,
        backgroundColor: 'white',
    },
    listTitle: {
        fontFamily: 'bebas-neue',
        marginTop: 20,
        fontSize: 18,
        color: 'white'
    },
    background: {
        backgroundColor: '#15bf4b',
        width: '100%',
        bottom: 0,
        top: 86,
        paddingLeft: '5%',
        position: 'absolute',
        borderBottomWidth: 0.5,
        borderColor: 'black',
        paddingBottom: 20
    },
    cardDate: {
        fontFamily: 'bebas-neue',
        opacity: 0.4,
        fontSize: 16,
        marginLeft: 1,
        marginTop: 2,

    },
    noText: {
        paddingBottom: 20,
    }
});

export const mapStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 26,
    },
})


// Sets the default style for the home page.
export const calendarStyles = StyleSheet.create({
    titleText: {
        fontFamily: 'bebas-neue',
        fontSize: 24,
        marginLeft: '10%',
        marginTop: 50
    },
    container: {
        backgroundColor: 'white',
        paddingTop: 26,
        paddingBottom: 10,
        height: '100%',
    },
    calendarView: {
        paddingHorizontal: "2%",
        paddingVertical: 30,
        width: '100%',
        
    },
    modalButton: {
        color:'#black',
        width: "90%"
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 26,
        paddingBottom: 10,
        
    },
    button: {
        fontSize: 20,
        backgroundColor: "pink",
        borderColor: "black",
        borderWidth: 2,
        marginTop: 30,
        paddingVertical: 6,
        paddingHorizontal: 10,
        width: '80%',
        textAlign: "center",
        fontFamily: 'bebas-neue',
        marginLeft: '10%'
    }, 
    textInput: {
        borderColor: '#000000', 
        borderBottomWidth: 2,
        width: '80%',
        marginLeft: '10%',
        height: 40,
        marginTop: 20,
        paddingHorizontal: 5,
    },
    timePicker: {
        width: '50%',
        marginLeft: '40%',
        height: 30,
        marginTop: -20,
    },
    timeText: {
        color: "#7a7a79",
        marginTop: 20,
        marginLeft: '10%',
    },
    mainModal: {
        marginTop: 200
    },
    modalListView: {
        marginLeft: '10%',
        width: '80%',
        marginTop: 30,
        height: 50
    },
    listCard: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
        marginBottom: 20
    },
    editModal: {
        height: '100%',
        paddingBottom: 50,
    },
    editText: {
        marginTop: 10,
        marginLeft: '10%'
    },
    mapView: {
        width: '100%',
        marginLeft: '10%',
        marginTop: 30,
    },
    mapButton: {
        width: "80%"
    },
    mapBackground: {
        width: "100%",
        height: "100%",
        marginTop: -50,
        backgroundColor: 'white'
    }
});


