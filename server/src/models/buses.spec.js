"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var location_1 = require("./location");
var buses_1 = require("./buses");
var bus_1 = require("./bus");
require("mocha");
var utils_1 = require("../utils/utils");
describe('adding a new bus', function () {
    it('should add new bus', function () {
        var buses = new buses_1.Buses();
        var location = new location_1.Location({ latitude: 51.36, longitude: -2.35 });
        var bus = buses.newBus(location);
        chai_1.expect(bus).to.deep.equal(new bus_1.Bus(0, location));
    });
    it('should return list of Jsoned buses', function () {
        var location0 = utils_1.Utils.location.generateValidLocation();
        var location1 = utils_1.Utils.location.generateValidLocation();
        var location2 = utils_1.Utils.location.generateValidLocation();
        var expectedData = [
            {
                busId: 0,
                location: location0
            },
            {
                busId: 1,
                location: location1
            },
            {
                busId: 2,
                location: location2
            }
        ];
        var buses = new buses_1.Buses();
        buses.newBus(new location_1.Location(location0));
        buses.newBus(new location_1.Location(location1));
        buses.newBus(new location_1.Location(location2));
        chai_1.expect(buses.toJson()).to.deep.equal(expectedData);
    });
});
