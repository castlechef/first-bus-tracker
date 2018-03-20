"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const buses_1 = require("./buses");
const bus_1 = require("./bus");
require("mocha");
const utils_1 = require("../utils/utils");
var generateValidLocations = utils_1.Utils.location.generateValidLocations;
const busStops_1 = require("./busStops");
let buses, busStops;
describe('buses', () => {
    beforeEach(() => {
        busStops = new busStops_1.BusStops([]);
        buses = new buses_1.Buses(busStops);
    });
    describe('containsBus', () => {
        it('should not contain buses when empty', () => {
            chai_1.expect(buses.containsBus(0)).to.be.false;
        });
        it('should contain bus after being added', () => {
            const validLocation = utils_1.Utils.location.generateValidLocation();
            const expectedBusId = 0;
            chai_1.expect(buses.containsBus(expectedBusId)).to.be.false;
            const bus = buses.createAndInsertBus(validLocation, busStops_1.BusRouteName.U2);
            chai_1.expect(bus.id).to.equal(expectedBusId);
            chai_1.expect(buses.containsBus(expectedBusId)).to.be.true;
        });
        it('should not contain bus after being removed', () => {
            const validLocation = utils_1.Utils.location.generateValidLocation();
            chai_1.expect(buses.containsBus(0)).to.be.false;
            buses.createAndInsertBus(validLocation, busStops_1.BusRouteName.U2);
            chai_1.expect(buses.containsBus(0)).to.be.true;
            buses.removeBus(0);
            chai_1.expect(buses.containsBus(0)).to.be.false;
        });
    });
    describe('getBus', () => {
        it('should throw an error if the bus has not been inserted', () => {
            chai_1.expect(() => buses.getBus(0)).to.throw(Error, 'Bus not found');
        });
        it('should return the bus after it has been inserted', () => {
            const bus = buses.createAndInsertBus(utils_1.Utils.location.generateValidLocation(), busStops_1.BusRouteName.U2);
            chai_1.expect(buses.getBus(bus.id)).to.deep.equal(bus);
        });
    });
    describe('createAndInsertBus', () => {
        it('should throw error if location is invalid', () => {
            chai_1.expect(() => buses.createAndInsertBus(undefined, busStops_1.BusRouteName.U2)).to.throw(Error, 'Invalid bus');
        });
        it('should return new bus once added', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const bus = buses.createAndInsertBus(location, busStops_1.BusRouteName.U2);
            chai_1.expect(bus).to.deep.equal(new bus_1.Bus(bus.id, location, busStops_1.BusRouteName.U2, busStops.getStopsWithRoute(busStops_1.BusRouteName.U2)));
        });
    });
    describe('removeAllBuses', () => {
        it('should remove all buses from the list', () => {
            const numberOfBuses = 1000;
            const locations = generateValidLocations(numberOfBuses);
            const bus = [];
            locations.forEach(location => bus.push(buses.createAndInsertBus(location, busStops_1.BusRouteName.U2)));
            bus.forEach(bus => chai_1.expect(buses.containsBus(bus.id)).to.be.true);
            buses.removeAllBuses();
            bus.forEach(bus => chai_1.expect(buses.containsBus(bus.id)).to.be.false);
        });
    });
    describe('toJSON', () => {
        it('should return list of Jsoned buses', () => {
            const location0 = utils_1.Utils.location.generateValidLocation();
            const location1 = utils_1.Utils.location.generateValidLocation();
            const location2 = utils_1.Utils.location.generateValidLocation();
            const expectedData = [
                {
                    busId: 0,
                    location: location0.toJSON(),
                    routeName: busStops_1.BusRouteName.U1X
                },
                {
                    busId: 1,
                    location: location1.toJSON(),
                    routeName: busStops_1.BusRouteName.U1X
                },
                {
                    busId: 2,
                    location: location2.toJSON(),
                    routeName: busStops_1.BusRouteName.U1X
                }
            ];
            buses.createAndInsertBus(location0, busStops_1.BusRouteName.U1X);
            buses.createAndInsertBus(location1, busStops_1.BusRouteName.U1X);
            buses.createAndInsertBus(location2, busStops_1.BusRouteName.U1X);
            chai_1.expect(buses.toJSON()).to.deep.equal(expectedData);
        });
        it('should empty array when empty', () => {
            chai_1.expect(buses.toJSON()).to.deep.equal([]);
        });
    });
    describe('getExpectedArrivalsAtStop', () => {
        const data = require('../../data.json');
        const busStops = new busStops_1.BusStops(data.busStops);
        buses = new buses_1.Buses(busStops);
        it('Should return arrival times of 2 buses', () => {
            const data = require('../../data.json');
            const busStops = new busStops_1.BusStops(data.busStops);
            const routeU2 = busStops.getStopsWithRoute(busStops_1.BusRouteName.U2);
            buses = new buses_1.Buses(busStops);
            let bus0 = buses.createAndInsertBus(routeU2[0].location, busStops_1.BusRouteName.U2);
            let bus1 = buses.createAndInsertBus(routeU2[6].location, busStops_1.BusRouteName.U2);
            bus0.updateLocation(routeU2[1].location);
            bus1.updateLocation(routeU2[7].location);
            bus0.updateLocation(routeU2[2].location);
            bus1.updateLocation(routeU2[8].location);
            console.log(buses.getExpectedArrivalsAtStop(routeU2[9]));
        });
    });
});
//# sourceMappingURL=buses.spec.js.map