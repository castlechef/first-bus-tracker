"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busStops_1 = require("./busStops");
const chai_1 = require("chai");
describe('BusStops', () => {
    describe('getStopsWithRoute method', () => {
        it('should get all stops on a given route', () => {
            const data = [
                {
                    'name': 'bus stop 1',
                    'location': {
                        'latitude': 51.3553,
                        'longitude': -2.395
                    },
                    'routes': [
                        { 'name': 'U2', 'position': 1 }
                    ]
                },
                {
                    'name': 'bus stop 2',
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
    });
});
//# sourceMappingURL=busStops.spec.js.map