"use strict";
exports.__esModule = true;
var location_1 = require("../models/location");
var Utils;
(function (Utils) {
    var Numeric;
    (function (Numeric) {
        function randomBetweenNumbers(min, max) {
            var r = (Math.random() * (max - min)) + min;
            return (r === min) ? this.randomBetweenNumbers(min, max) : r;
        }
        Numeric.randomBetweenNumbers = randomBetweenNumbers;
    })(Numeric = Utils.Numeric || (Utils.Numeric = {}));
    var location;
    (function (location) {
        location.validLat = (location_1.Location.MIN_LATITUDE + location_1.Location.MAX_LATITUDE) / 2;
        location.validLon = (location_1.Location.MIN_LONGITUDE + location_1.Location.MAX_LONGITUDE) / 2;
        location.invalidLocationData = [
            { name: 'undefined latitude', location: { latitude: undefined, longitude: location.validLon } },
            { name: 'undefined longitude', location: { latitude: location.validLat, longitude: undefined } },
            { name: 'undefined both longitude and latitude', location: { latitude: undefined, longitude: undefined } },
            { name: 'boolean latitude', location: { latitude: true, longitude: location.validLon } },
            { name: 'boolean longitude', location: { latitude: location.validLat, longitude: true } },
            { name: 'boolean both longitude and latitude', location: { latitude: false, longitude: false } },
            { name: 'string both longitude and latitude', location: { latitude: 'hello', longitude: 'world' } },
            { name: 'NaN both longitude and latitude', location: { latitude: NaN, longitude: NaN } },
            { name: 'alphanumeric both longitude and latitude', location: { latitude: '2.a34', longitude: '432.sdq3wr' } },
            { name: 'out of range latitude', location: { latitude: 48, longitude: location.validLon } },
            { name: 'out of range longitude', location: { latitude: location.validLat, longitude: -12.35 } },
            { name: 'max boundary latitude', location: { latitude: location_1.Location.MAX_LATITUDE, longitude: location.validLon } },
            { name: 'min boundary latitude', location: { latitude: location_1.Location.MIN_LATITUDE, longitude: location.validLon } },
            { name: 'max boundary longitude', location: { latitude: location.validLat, longitude: location_1.Location.MAX_LONGITUDE } },
            { name: 'min boundary longitude', location: { latitude: location.validLat, longitude: location_1.Location.MIN_LONGITUDE } }
        ];
        function generateValidLocation() {
            var latitude = Numeric.randomBetweenNumbers(location_1.Location.MIN_LATITUDE, location_1.Location.MAX_LATITUDE);
            var longitude = Numeric.randomBetweenNumbers(location_1.Location.MIN_LONGITUDE, location_1.Location.MAX_LONGITUDE);
            return new location_1.Location({ latitude: latitude, longitude: longitude });
        }
        location.generateValidLocation = generateValidLocation;
        function generateValidLocations(length) {
            return Array.from({ length: length }, generateValidLocation);
        }
        location.generateValidLocations = generateValidLocations;
    })(location = Utils.location || (Utils.location = {}));
})(Utils = exports.Utils || (exports.Utils = {}));
