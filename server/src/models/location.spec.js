"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var location_1 = require("./location");
require("mocha");
describe('Locations', function () {
    var validLat = (location_1.Location.MIN_LATITUDE + location_1.Location.MAX_LATITUDE) / 2;
    var validLon = (location_1.Location.MIN_LONGITUDE + location_1.Location.MAX_LONGITUDE) / 2;
    describe('isValidLocation', function () {
        var tests = [
            { name: 'undefined latitude', args: { latitude: undefined, longitude: validLon }, expected: false },
            { name: 'undefined longitude', args: { latitude: validLat, longitude: undefined }, expected: false },
            { name: 'undefined both', args: { latitude: undefined, longitude: undefined }, expected: false },
            { name: 'boolean latitude', args: { latitude: true, longitude: validLon }, expected: false },
            { name: 'boolean longitude', args: { latitude: validLat, longitude: true }, expected: false },
            { name: 'boolean both', args: { latitude: false, longitude: false }, expected: false },
            { name: 'string types', args: { latitude: 'hello', longitude: 'world' }, expected: false },
            { name: 'NaN types', args: { latitude: NaN, longitude: NaN }, expected: false },
            { name: 'alphanumeric types', args: { latitude: '2.a34', longitude: '432.sdq3wr' }, expected: false },
            { name: 'out of range latitude', args: { latitude: 48, longitude: validLon }, expected: false },
            { name: 'out of range longitude', args: { latitude: validLat, longitude: -12.35 }, expected: false },
            { name: 'max boundary latitude', args: { latitude: location_1.Location.MAX_LATITUDE, longitude: validLon }, expected: false },
            { name: 'min boundary latitude', args: { latitude: location_1.Location.MIN_LATITUDE, longitude: validLon }, expected: false },
            { name: 'max boundary longitude', args: { latitude: validLat, longitude: location_1.Location.MAX_LONGITUDE }, expected: false },
            { name: 'min boundary longitude', args: { latitude: validLat, longitude: location_1.Location.MIN_LONGITUDE }, expected: false },
            { name: 'min boundary longitude', args: { latitude: validLat, longitude: validLon }, expected: true },
        ];
        tests.forEach(function (test) {
            var type = (test.expected) ? 'accepts' : 'rejects';
            it(type + " " + test.name, function () {
                chai_1.expect(location_1.Location.isValidLocation(test.args)).equal(test.expected);
            });
        });
        it('throws property error when undefined object sent', function () {
            chai_1.assert.throws(function () {
                location_1.Location.isValidLocation(undefined);
            }, Error, 'Cannot read property \'latitude\' of undefined');
        });
        it('throws property error when null object sent', function () {
            chai_1.assert.throws(function () {
                location_1.Location.isValidLocation(null);
            }, Error, 'Cannot read property \'latitude\' of null');
        });
    });
    describe('constructor', function () {
        it('should not accept invalid ILocations', function () {
            chai_1.assert.throws(function () { return new location_1.Location(undefined); });
        });
    });
    describe('toJson', function () {
        it('should be sensible', function () {
            var location = new location_1.Location({ latitude: 51.36, longitude: -2.35 });
            var jsonLocation = location.toJson();
            var testData = {
                latitude: 51.36,
                longitude: -2.35
            };
            chai_1.expect(jsonLocation).to.deep.equal(testData);
        });
    });
});
