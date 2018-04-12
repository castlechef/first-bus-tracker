"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Location {
    constructor({ latitude, longitude }) {
        if (!Location.isValidLocation({ latitude, longitude })) {
            throw new Error('Invalid ILocation parameter');
        }
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
    distanceFrom(otherLocation) {
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
    bearingTo(otherLocation) {
        function toRadians(n) { return n * Math.PI / 180; }
        const { sin, cos, atan2 } = Math;
        const lat1 = toRadians(this.latitude);
        const lat2 = toRadians(otherLocation.latitude);
        const lon1 = toRadians(this.longitude);
        const lon2 = toRadians(otherLocation.longitude);
        return (atan2(sin(lon2 - lon1) * cos(lat2), cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lon2 - lon1)) * (180 / Math.PI) + 360) % 360;
    }
    moveInDirectionOf(otherLocation, distance) {
        function toRadians(n) { return n * Math.PI / 180; }
        function toDegrees(n) { return n * 180 / Math.PI; }
        const { sin, cos, atan2, asin, PI } = Math;
        const bearing = toRadians(this.bearingTo(otherLocation));
        const lat = toRadians(this.latitude);
        const lon = toRadians(this.longitude);
        const earthRadiusInMetres = 6371000;
        const distFrac = distance / earthRadiusInMetres;
        const latitudeResult = asin(sin(lat) * cos(distFrac) + cos(lat) * sin(distFrac) * cos(bearing));
        const a = atan2(sin(bearing) * sin(distFrac) * cos(lat), cos(distFrac) - sin(lat) * sin(latitudeResult));
        const longitudeResult = (lon + a + 3 * PI) % (2 * PI) - PI;
        return new Location({ latitude: toDegrees(latitudeResult), longitude: toDegrees(longitudeResult) });
    }
    static distanceBetweenN(locations) {
        let total = 0;
        for (let i = 0; i < locations.length - 1; i++) {
            total += locations[i].distanceFrom(locations[i + 1]);
        }
        return total;
    }
    static nearestBusStopToLocation(location, busStops) {
        return busStops.reduce((t, e) => t = (t && location.distanceFrom(t.location) < location.distanceFrom(e.location)) ? t : e);
    }
}
Location.MAX_LATITUDE = 51.391178;
Location.MIN_LATITUDE = 51.355208;
Location.MAX_LONGITUDE = -2.310755;
Location.MIN_LONGITUDE = -2.403184;
exports.Location = Location;
//# sourceMappingURL=location.js.map