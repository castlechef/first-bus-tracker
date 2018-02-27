"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
require("mocha");
var bus_1 = require("./bus");
var utils_1 = require("../utils/utils");
describe('bus', function () {
    describe('constructor', function () {
        describe('should throw error with invalid id type', function () {
            var location = utils_1.Utils.location.generateValidLocation();
            var tests = [
                { testName: ' null', id: null },
                { testName: 'n undefined', id: undefined },
                { testName: 'n alphanumeric', id: 'sdfe23' },
                { testName: ' string number', id: '11' },
                { testName: 'n object containing id property', id: { id: 11 } }
            ];
            tests.forEach(function (_a) {
                var name = _a.testName, id = _a.id;
                it("should throw error with a" + name + " valued id", function () {
                    chai_1.expect(function () { return new bus_1.Bus(id, location); }).to["throw"](Error, 'invalid parameter');
                });
            });
        });
        describe('should throw error with invalid location', function () {
            var validId = 0;
            var tests = [
                { locationType: 'undefined', location: undefined },
                { locationType: 'null', location: null },
                { locationType: 'POJO location', location: utils_1.Utils.location.generateValidLocation().toJson() },
                { locationType: 'string', location: 'latitude: 12, longitude: 52' }
            ];
            tests.forEach(function (_a) {
                var locationType = _a.locationType, location = _a.location;
                it("should not allow " + locationType + " type location", function () {
                    chai_1.expect(function () { return new bus_1.Bus(validId, location); }).to["throw"](Error, 'invalid parameter');
                });
            });
        });
    });
    describe('updateLocation', function () {
        describe('should reject invalid locations', function () {
            var validId = 0;
            var bus = new bus_1.Bus(validId, utils_1.Utils.location.generateValidLocation());
            var tests = [
                { locationType: 'undefined', location: undefined },
                { locationType: 'null', location: null },
                { locationType: 'POJO location', location: utils_1.Utils.location.generateValidLocation().toJson() },
                { locationType: 'string', location: 'latitude: 12, longitude: 52' }
            ];
            tests.forEach(function (_a) {
                var locationType = _a.locationType, location = _a.location;
                it("should not allow " + locationType + " type location", function () {
                    chai_1.expect(function () { return bus.updateLocation(location); }).to["throw"](Error, 'invalid location');
                });
            });
        });
    });
    describe('toJson', function () {
        it('should return valid json data of object', function () {
            var validId = 0;
            var validLocation = utils_1.Utils.location.generateValidLocation();
            var bus = new bus_1.Bus(validId, validLocation);
            var expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation.latitude,
                    longitude: validLocation.longitude
                }
            };
            chai_1.expect(bus.toJson()).to.deep.equal(expectedJson);
        });
        it('should return valid json data after location update', function () {
            var validId = 0;
            var validLocation1 = utils_1.Utils.location.generateValidLocation();
            var validLocation2 = utils_1.Utils.location.generateValidLocation();
            var bus = new bus_1.Bus(validId, validLocation1);
            bus.updateLocation(validLocation2);
            var expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation2.latitude,
                    longitude: validLocation2.longitude
                }
            };
            chai_1.expect(bus.toJson()).to.deep.equal(expectedJson);
        });
    });
});
