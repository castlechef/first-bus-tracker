"use strict";
exports.__esModule = true;
var bus_1 = require("./bus");
var Buses = (function () {
    function Buses() {
        this.busList = [];
        this.currentId = 0;
    }
    Buses.prototype.constainsBus = function (id) {
        for (var i = 0; i < this.busList.length; i++) {
            var bus = this.busList[i];
            if (bus.id === id)
                return true;
        }
        return false;
    };
    Buses.prototype.newBus = function (location) {
        var id = this.generateBusId();
        var bus = new bus_1.Bus(id, location);
        this.busList.push(bus);
        return bus;
    };
    Buses.prototype.removeAllBuses = function () {
        while (this.busList.length > 0) {
            this.busList.pop();
        }
        this.currentId = 0;
    };
    Buses.prototype.toJson = function () {
        var jsonList = [];
        for (var i = 0; i < this.busList.length; i++) {
            jsonList.push(this.busList[i].toJson());
        }
        return jsonList;
    };
    Buses.prototype.generateBusId = function () {
        return this.currentId++;
    };
    return Buses;
}());
exports.Buses = Buses;
