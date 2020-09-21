// Creates an easy way to store events so they can be used throughout my app and stored in firebase. 
export class EventObject {
    constructor(id, name, date, location, startHour, startMinutes, endHour, endMinutes, latitude, longitude) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.location = location;
        this.startHour = startHour;
        this.startMinutes = startMinutes;
        this.endHour = endHour;
        this.endMinutes = endMinutes;
        this.latitude = latitude;
        this.longitude = longitude;

        this.fixStartMinutes()
        this.fixStartHour()

        this.fixEndMinutes()
        this.fixEndHour()
    }

    getId() {
        return this.id
    }

    getName() {
        return this.name;
    }

    getDate() {
        return this.date;
    }

    getLocation() {
        return this.location;
    }

    getStartHour() {
        return this.startHour;
    }

    getStartMinutes() {
        return this.startMinutes;
    }

    getEndHour() {
        return this.endHour;
    }

    getEndMinutes() {
        return this.endMinutes;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    // Fixes the format of the starting time's hour.
    fixStartHour() {
        if (this.startHour > 12 && this.startHour < 24) {
            this.startHour = this.startHour % 12
            this.startMinutes += " PM"
        }
        else if (this.startHour === "0") {
            this.startHour = 12;
            this.startMinutes += " AM"
        }
        else {
            this.startMinutes += " AM"
        }
    }

    // Makes sure all times are formatted to two places.
    fixStartMinutes() {
        if (this.startMinutes.length === 1) {
            this.startMinutes += "0"
        }
    }

    // Fixes the format of the ending time's hour.
    fixEndHour() {
        if (this.endHour > 12 && this.endHour < 24) {
            this.endHour = this.endHour % 12
            this.endMinutes += " PM"
        }
        else if (this.endHour === "0") {
            this.endHour = 12;
            this.endMinutes += " AM"
        }
        else {
            this.endMinutes += " AM"
        }
    }

    // Makes sure all times are formatted to two places.
    fixEndMinutes() {
        if (this.endMinutes.length === 1) {
            this.endMinutes += "0"
        }
    }

    toString() {
        return "Event: " + this.name + " on " + this.date + " at " + this.location + "( " 
        + (this.latitude).toFixed(4) + ", " + (this.longitude).toFixed(4) + " )" 
        + " from " + this.startHour + ":" + this.startMinutes + " to " + this.endHour 
        + ":" + this.endMinutes;
    }
}
