"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var location_1 = require("./location");
var Bus = (function () {
    function Bus(id, location) {
        if (typeof id !== "number" || !(location instanceof location_1.Location))
            throw new Error('invalid parameter');
        this._id = id;
        this.locations = [];
        this.updateLocation(location);
    }
    Bus.prototype.updateLocation = function (location) {
        if (!(location instanceof location_1.Location))
            throw new Error('invalid location');
        //this.location = location;
        this.locations.push(location);
    };
    Bus.prototype.getLatestLocation = function () {
        return this.locations[this.locations.length - 1];
    };
    Object.defineProperty(Bus.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Bus.prototype.toJson = function () {
        return {
            busId: this.id,
            location: this.getLatestLocation().toJson()
        };
    };
    return Bus;
}());
exports.Bus = Bus;
