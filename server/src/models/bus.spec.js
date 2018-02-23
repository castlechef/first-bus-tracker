"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var location_1 = require("./location");
var bus_1 = require("./bus");
describe('adding a new bus', function () {
    it('should be sensible', function () {
        var location = new location_1.Location({ latitude: 52.36, longitude: -2.35 });
        var bus = new bus_1.Bus(0, location);
        var jsonLocation = bus.toJson();
        var testData = {
            busId: 0,
            location: {
                latitude: 52.36,
                longitude: -2.35
            }
        };
        chai_1.expect(jsonLocation).to.deep.equal(testData);
    });
});
