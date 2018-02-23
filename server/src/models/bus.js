"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bus = (function () {
    function Bus(id, location) {
        this._id = id;
        this.location = location;
    }
    Bus.prototype.updateLocation = function (location) {
        this.location = location;
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
            location: this.location.toJson()
        };
    };
    return Bus;
}());
exports.Bus = Bus;
