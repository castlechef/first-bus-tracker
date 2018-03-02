"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var location_1 = require("./location");
require("mocha");
var utils_1 = require("../utils/utils");
describe('location', function () {
    describe('isValidLocation', function () {
        var tests = [
            { name: 'undefined location', args: undefined, expected: false },
            { name: 'null location', args: null, expected: false },
            { name: 'undefined latitude', args: { latitude: undefined, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'undefined longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: undefined }, expected: false },
            { name: 'undefined both', args: { latitude: undefined, longitude: undefined }, expected: false },
            { name: 'boolean latitude', args: { latitude: true, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'boolean longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: true }, expected: false },
            { name: 'boolean both', args: { latitude: false, longitude: false }, expected: false },
            { name: 'string types', args: { latitude: 'hello', longitude: 'world' }, expected: false },
            { name: 'NaN types', args: { latitude: NaN, longitude: NaN }, expected: false },
            { name: 'alphanumeric types', args: { latitude: '2.a34', longitude: '432.sdq3wr' }, expected: false },
            { name: 'out of range latitude', args: { latitude: 48, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'out of range longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: -12.35 }, expected: false },
            { name: 'max boundary latitude', args: { latitude: location_1.Location.MAX_LATITUDE, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'min boundary latitude', args: { latitude: location_1.Location.MIN_LATITUDE, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'max boundary longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: location_1.Location.MAX_LONGITUDE }, expected: false },
            { name: 'min boundary longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: location_1.Location.MIN_LONGITUDE }, expected: false },
            { name: 'min boundary longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: utils_1.Utils.location.validLon }, expected: true },
        ];
        tests.forEach(function (test) {
            var type = (test.expected) ? 'accepts' : 'rejects';
            it(type + " " + test.name, function () {
                chai_1.expect(location_1.Location.isValidLocation(test.args)).equal(test.expected);
            });
        });
    });
    describe('constructor', function () {
        it('should throw error with undefined ILocations', function () {
            chai_1.expect(function () { return new location_1.Location(undefined); }).throws(Error);
        });
        it('should throw error with null ILocations', function () {
            chai_1.expect(function () { return new location_1.Location(null); }).throws(Error);
        });
    });
    describe('toJson', function () {
        it('should return json object with correct data', function () {
            var location = utils_1.Utils.location.generateValidLocation();
            var jsonLocation = location.toJson();
            var latitude = location.latitude, longitude = location.longitude;
            var testData = {
                latitude: latitude,
                longitude: longitude
            };
            chai_1.expect(jsonLocation).to.deep.equal(testData);
        });
    });
    describe('get latitude/longitude', function () {
        var latitude = utils_1.Utils.location.validLat;
        var longitude = utils_1.Utils.location.validLon;
        var location = new location_1.Location({ latitude: latitude, longitude: longitude });
        it('should return the latitude provided in the constructor', function () {
            chai_1.expect(location.latitude).to.equal(latitude);
        });
        it('should return the longitude provided in the constructor', function () {
            chai_1.expect(location.longitude).to.equal(longitude);
        });
    });
});
