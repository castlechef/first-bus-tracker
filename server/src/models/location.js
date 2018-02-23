"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Location = (function () {
    function Location(_a) {
        var latitude = _a.latitude, longitude = _a.longitude;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    Location.validateLocation = function (_a) {
        var latitude = _a.latitude, longitude = _a.longitude;
        return Location.validateLatitude(latitude) && Location.validateLongitude(longitude);
    };
    Location.validateLatitude = function (l) {
        if (!l)
            return false;
        if (typeof l !== 'number')
            return false;
        if (l > Location.MIN_LATITUDE && l < Location.MAX_LATITUDE)
            return true;
        return false;
    };
    Location.validateLongitude = function (l) {
        if (!l)
            return false;
        if (typeof l !== 'number')
            return false;
        if (l > Location.MIN_LONGITUDE && l < Location.MAX_LONGITUDE)
            return true;
        return false;
    };
    Location.prototype.toJson = function () {
        return {
            latitude: this.latitude,
            longitude: this.longitude
        };
    };
    return Location;
}());
Location.MAX_LATITUDE = 51.391178;
Location.MIN_LATITUDE = 51.355208;
Location.MAX_LONGITUDE = -2.310755;
Location.MIN_LONGITUDE = -2.403184;
exports.Location = Location;
