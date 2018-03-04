"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bus_1 = require("./bus");
var Buses = (function () {
    function Buses() {
        this.busList = [];
        this.busMap = new Map();
        this.currentId = 0;
    }
    Buses.prototype.containsBus = function (id) {
        //return this.busMap.has(id);
        return this.busList.some(function (bus) { return bus.id === id; });
    };
    Buses.prototype.getBus = function (id) {
        //const bus = this.busMap.get(id);
        var bus = this.busList.find(function (bus) { return bus.id === id; });
        if (!bus)
            throw new Error('Bus not found');
        return bus;
    };
    Buses.prototype.createAndInsertBus = function (location) {
        var id = this.generateBusId();
        var bus = new bus_1.Bus(id, location);
        this.busList.push(bus);
        //this.busMap.set(id, bus);
        return bus;
    };
    Buses.prototype.removeBus = function (id) {
        if (!this.containsBus(id))
            throw new Error('bus not found');
        //this.busMap.delete(id);
        this.busList.splice(this.busList.indexOf(this.busList.find(function (bus) { return bus.id === id; })), 1);
    };
    Buses.prototype.removeAllBuses = function () {
        while (this.busList.length > 0) {
            this.busList.pop();
        }
        this.currentId -= this.currentId;
        //this.busMap.clear();
    };
    Buses.prototype.toJson = function () {
        var jsonList = [];
        //this.busMap.forEach(bus => jsonList.push(bus.toJson()));
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
