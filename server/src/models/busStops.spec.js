"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busStops_1 = require("./busStops");
const chai_1 = require("chai");
const utils_1 = require("../utils/utils");
var generateValidLocation = utils_1.Utils.location.generateValidLocation;
const bus_1 = require("./bus");
const app_1 = require("../app");
describe('BusStops', () => {
    describe('constructor', () => {
        it('should throw error when a route does not have a first stop', () => {
            const busStopData = [
                {
                    busStopName: 'Bus stop 1',
                    location: generateValidLocation().toJSON(),
                    routes: [
                        { name: busStops_1.BusRouteName.U2, position: 2 },
                    ]
                },
                {
                    busStopName: 'Bus stop 2',
                    location: generateValidLocation().toJSON(),
                    routes: [
                        { name: busStops_1.BusRouteName.U2, position: 3 }
                    ]
                }
            ];
            chai_1.expect(() => new busStops_1.BusStops(busStopData)).throw(Error, "Invalid config.\nError: Bus route U2 does not have a first stop");
        });
        it('should throw error when bus stop positions are not complete', () => {
            const busStopsData = [
                {
                    busStopName: 'Bus stop 1',
                    location: generateValidLocation().toJSON(),
                    routes: [
                        { name: busStops_1.BusRouteName.U2, position: 1 }
                    ]
                },
                {
                    busStopName: 'Bus stop 2',
                    location: generateValidLocation().toJSON(),
                    routes: [
                        { name: busStops_1.BusRouteName.U2, position: 2 }
                    ]
                },
                {
                    busStopName: 'Bus stop 3',
                    location: generateValidLocation().toJSON(),
                    routes: [
                        { name: busStops_1.BusRouteName.U2, position: 4 }
                    ]
                }
            ];
            chai_1.expect(() => new busStops_1.BusStops(busStopsData)).to.throw(Error, 'Invalid config.\nError: Bus route U2 stop 4 (Bus stop 3) does not follow from 2 (Bus stop 2)');
        });
    });
    describe('getStopsWithRoute method', () => {
        it('should get all stops on a given route', () => {
            const data = [
                {
                    'busStopName': 'bus stop 1',
                    'location': {
                        'latitude': 51.3553,
                        'longitude': -2.395
                    },
                    'routes': [
                        { 'name': 'U2', 'position': 1 }
                    ]
                },
                {
                    'busStopName': 'bus stop 2',
                    'location': {
                        'latitude': 51.3554,
                        'longitude': -2.39
                    },
                    'routes': [
                        { 'name': 'U2', 'position': 2 }
                    ]
                }
            ];
            const busStops = new busStops_1.BusStops(data);
            chai_1.expect(busStops.getStopsWithRoute(busStops_1.BusRouteName.U2).length).to.deep.equal(data.length);
        });
        it('should return empty array if route if not recognised', () => {
            const data = [
                {
                    'busStopName': 'bus stop 1',
                    'location': {
                        'latitude': 51.3553,
                        'longitude': -2.395
                    },
                    'routes': [
                        { 'name': 'U2', 'position': 1 }
                    ]
                },
                {
                    'busStopName': 'bus stop 2',
                    'location': {
                        'latitude': 51.3554,
                        'longitude': -2.39
                    },
                    'routes': [
                        { 'name': 'U2', 'position': 2 }
                    ]
                }
            ];
            const busStops = new busStops_1.BusStops(data);
            chai_1.expect(busStops.getStopsWithRoute(undefined)).to.deep.equal([]);
        });
    });
    describe('arrivalsToJSON', () => {
        it('should return an object', () => {
            const validId = 0;
            const validLocation = utils_1.Utils.location.generateValidLocation();
            const bus0 = new bus_1.Bus(validId, validLocation, busStops_1.BusRouteName.U2, app_1.busStops.getStopsWithRoute(busStops_1.BusRouteName.U2));
            const bus1 = new bus_1.Bus(validId + 1, validLocation, busStops_1.BusRouteName.U2, app_1.busStops.getStopsWithRoute(busStops_1.BusRouteName.U2));
            let arrivals = [
                {
                    bus: bus0,
                    arrivalTime: 1521554504179
                },
                {
                    bus: bus1,
                    arrivalTime: 1521554504179
                }
            ];
            const expectedJson = [
                {
                    "busId": 0,
                    "routeName": "U2",
                    "arrivalTime": "14:01"
                },
                {
                    "busId": 1,
                    "routeName": "U2",
                    "arrivalTime": "14:01"
                }
            ];
            chai_1.expect(app_1.busStops.arrivalsToJSON(arrivals)).to.deep.equal(expectedJson);
        });
    });
});
//# sourceMappingURL=busStops.spec.js.map