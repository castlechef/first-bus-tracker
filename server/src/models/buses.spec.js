"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var location_1 = require("./location");
var buses_1 = require("./buses");
var bus_1 = require("./bus");
require("mocha");
describe('adding a new bus', function () {
    it('should add new bus', function () {
        var buses = new buses_1.Buses();
        var location = new location_1.Location({ latitude: 52.36, longitude: -2.35 });
        var bus = buses.newBus(location);
        chai_1.expect(bus).to.deep.equal(new bus_1.Bus(0, location));
    });
    it('should return list of Jsoned buses', function () {
        var location0 = generateValidLocation();
        var location1 = generateValidLocation();
        var location2 = generateValidLocation();
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
function generateValidLocation() {
    var latitude = (Math.random() * location_1.Location.MAX_LATITUDE) + location_1.Location.MIN_LATITUDE;
    var longitude = (Math.random() * location_1.Location.MAX_LONGITUDE) + location_1.Location.MIN_LONGITUDE;
    return {
        latitude: latitude,
        longitude: longitude
    };
}
