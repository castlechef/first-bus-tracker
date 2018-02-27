"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var buses_1 = require("./buses");
var bus_1 = require("./bus");
require("mocha");
var utils_1 = require("../utils/utils");
var generateValidLocations = utils_1.Utils.location.generateValidLocations;
var buses;
describe('buses', function () {
    beforeEach(function () {
        buses = new buses_1.Buses();
    });
    describe('containsBus', function () {
        it('should not contain buses when empty', function () {
            chai_1.expect(buses.containsBus(0)).to.be["false"];
        });
        it('should contain bus after being added', function () {
            var validLocation = utils_1.Utils.location.generateValidLocation();
            var expectedBusId = 0;
            chai_1.expect(buses.containsBus(expectedBusId)).to.be["false"];
            var bus = buses.createAndInsertBus(validLocation);
            chai_1.expect(bus.id).to.equal(expectedBusId);
            chai_1.expect(buses.containsBus(expectedBusId)).to.be["true"];
        });
        it('should not contain bus after being removed', function () {
            var validLocation = utils_1.Utils.location.generateValidLocation();
            chai_1.expect(buses.containsBus(0)).to.be["false"];
            buses.createAndInsertBus(validLocation);
            chai_1.expect(buses.containsBus(0)).to.be["true"];
            buses.removeBus(0);
            chai_1.expect(buses.containsBus(0)).to.be["false"];
        });
    });
    describe('getBus', function () {
        it('should throw an error if the bus has not been inserted', function () {
            chai_1.expect(function () { return buses.getBus(0); }).to["throw"](Error, 'Bus not found');
        });
        it('should return the bus after it has been inserted', function () {
            var bus = buses.createAndInsertBus(utils_1.Utils.location.generateValidLocation());
            chai_1.expect(buses.getBus(bus.id)).to.deep.equal(bus);
        });
    });
    describe('createAndInsertBus', function () {
        it('should throw error if location is invalid', function () {
            chai_1.expect(function () { return buses.createAndInsertBus(undefined); }).to["throw"](Error, 'invalid parameter');
        });
        it('should return new bus once added', function () {
            var location = utils_1.Utils.location.generateValidLocation();
            var bus = buses.createAndInsertBus(location);
            chai_1.expect(bus).to.deep.equal(new bus_1.Bus(bus.id, location));
        });
    });
    describe('removeAllBuses', function () {
        it('should remove all buses from the list', function () {
            var numberOfBuses = 1000;
            var locations = generateValidLocations(numberOfBuses);
            var bus = [];
            locations.forEach(function (location) { return bus.push(buses.createAndInsertBus(location)); });
            bus.forEach(function (bus) { return chai_1.expect(buses.containsBus(bus.id)).to.be["true"]; });
            buses.removeAllBuses();
            bus.forEach(function (bus) { return chai_1.expect(buses.containsBus(bus.id)).to.be["false"]; });
        });
    });
    describe('toJson', function () {
        it('should return list of Jsoned buses', function () {
            var location0 = utils_1.Utils.location.generateValidLocation();
            var location1 = utils_1.Utils.location.generateValidLocation();
            var location2 = utils_1.Utils.location.generateValidLocation();
            var expectedData = [
                {
                    busId: 0,
                    location: location0.toJson()
                },
                {
                    busId: 1,
                    location: location1.toJson()
                },
                {
                    busId: 2,
                    location: location2.toJson()
                }
            ];
            buses.createAndInsertBus(location0);
            buses.createAndInsertBus(location1);
            buses.createAndInsertBus(location2);
            chai_1.expect(buses.toJson()).to.deep.equal(expectedData);
        });
        it('should empty array when empty', function () {
            chai_1.expect(buses.toJson()).to.deep.equal([]);
        });
    });
});
