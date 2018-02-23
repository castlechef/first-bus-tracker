"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var location_1 = require("./location");
describe('adding a new bus', function () {
    it('should be sensible', function () {
        var location = new location_1.Location({ latitude: 52.36, longitude: -2.35 });
        var jsonLocation = location.toJson();
        var testData = {
            latitude: 52.36,
            longitude: -2.35
        };
        chai_1.expect(jsonLocation).to.deep.equal(testData);
    });
});
