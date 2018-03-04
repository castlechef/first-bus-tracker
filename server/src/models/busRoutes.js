"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BusRouteName;
(function (BusRouteName) {
    BusRouteName["U1_CITY"] = "U1 City Centre";
    BusRouteName["U1_OLDFIELD"] = "U1 Oldfield Park";
    BusRouteName["U1_ABBEY"] = "U1 Bath Abbey";
    BusRouteName["U1X"] = "U1X";
    BusRouteName["U2"] = "U2";
})(BusRouteName = exports.BusRouteName || (exports.BusRouteName = {}));
var BusRoutes = (function () {
    function BusRoutes(stops) {
        this.stops = stops;
    }
    BusRoutes.prototype.toJson = function () {
        return {
            stops: this.stops.map(function (stop) { return stop.toJson(); })
        };
    };
    return BusRoutes;
}());
exports.BusRoutes = BusRoutes;
