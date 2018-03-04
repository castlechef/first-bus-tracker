"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BusStop = (function () {
    function BusStop(id, name, location, busRouteNames) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.busRouteNames = busRouteNames;
    }
    BusStop.prototype.hasRoute = function (busRoute) {
        return this.busRouteNames.includes(busRoute);
    };
    BusStop.prototype.toJson = function () {
        return {
            busStopId: this.id,
            busStopName: this.name,
            location: this.location.toJson()
        };
    };
    return BusStop;
}());
exports.BusStop = BusStop;
