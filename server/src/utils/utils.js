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
        function generateValidLocation() {
            var latitude = Numeric.randomBetweenNumbers(location_1.Location.MIN_LATITUDE, location_1.Location.MAX_LATITUDE);
            var longitude = Numeric.randomBetweenNumbers(location_1.Location.MIN_LONGITUDE, location_1.Location.MAX_LONGITUDE);
            return {
                latitude: latitude,
                longitude: longitude
            };
        }
        location.generateValidLocation = generateValidLocation;
        function generateValidLocations(length) {
            return Array.from({ length: length }, generateValidLocation);
        }
        location.generateValidLocations = generateValidLocations;
    })(location = Utils.location || (Utils.location = {}));
})(Utils = exports.Utils || (exports.Utils = {}));
