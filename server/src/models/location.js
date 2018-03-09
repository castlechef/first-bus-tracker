"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Location {
    constructor({ latitude, longitude }) {
        if (!Location.isValidLocation({ latitude, longitude }))
            throw new Error('Invalid ILocation parameter');
        this._latitude = latitude;
        this._longitude = longitude;
    }
    get latitude() {
        return this._latitude;
    }
    get longitude() {
        return this._longitude;
    }
    static isValidLocation(location) {
        if (!location)
            return false;
        const { latitude, longitude } = location;
        return Location.isValidLatitude(latitude) && Location.isValidLongitude(longitude);
    }
    static isValidLatitude(l) {
        if (!l)
            return false;
        if (typeof l !== 'number')
            return false;
        if (l > Location.MIN_LATITUDE && l < Location.MAX_LATITUDE)
            return true;
        return false;
    }
    static isValidLongitude(l) {
        if (!l)
            return false;
        if (typeof l !== 'number')
            return false;
        if (l > Location.MIN_LONGITUDE && l < Location.MAX_LONGITUDE)
            return true;
        return false;
    }
    toJSON() {
        return {
            latitude: this._latitude,
            longitude: this._longitude
        };
    }
    distatnceFrom(otherLocation) {
        function toRadians(n) { return n * Math.PI / 180; }
        const R = 6371e3;
        const theta1 = toRadians(this.latitude);
        const theta2 = toRadians(otherLocation.latitude);
        const deltaTheta = toRadians(otherLocation.latitude - this.latitude);
        const deltaLamda = toRadians(otherLocation.longitude - this.longitude);
        const a = (Math.sin(deltaTheta / 2) ** 2) + (Math.cos(theta1) * Math.cos(theta2) * (Math.sin(deltaLamda / 2) ** 2));
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
Location.MAX_LATITUDE = 51.391178;
Location.MIN_LATITUDE = 51.355208;
Location.MAX_LONGITUDE = -2.310755;
Location.MIN_LONGITUDE = -2.403184;
exports.Location = Location;
//# sourceMappingURL=location.js.map