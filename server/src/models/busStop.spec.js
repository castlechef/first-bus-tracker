"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const busStop_1 = require("./busStop");
const utils_1 = require("../utils/utils");
const busStops_1 = require("./busStops");
describe('BusStop', () => {
    describe('hasRoute method', () => {
        it('should accept routes it\'s been given', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: busStops_1.BusRouteName.U1X,
                    position: 4
                },
                {
                    name: busStops_1.BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new busStop_1.BusStop(1, 'Junction Road', location, busRouteData);
            chai_1.expect(busStop.hasRoute(busStops_1.BusRouteName.U2)).to.be.true;
        });
        it('should not accept routes it should not', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: busStops_1.BusRouteName.U1X,
                    position: 4
                },
                {
                    name: busStops_1.BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new busStop_1.BusStop(1, 'Junction Road', location, busRouteData);
            chai_1.expect(busStop.hasRoute(busStops_1.BusRouteName.U1_ABBEY)).to.be.false;
        });
    });
    describe('getPositionOfRoute method', () => {
        it('should throw error if the bus stop is not on the route', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: busStops_1.BusRouteName.U1X,
                    position: 4
                },
                {
                    name: busStops_1.BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new busStop_1.BusStop(1, 'Junction Road', location, busRouteData);
            chai_1.expect(() => busStop.getPositionOfRoute(busStops_1.BusRouteName.U1_ABBEY)).to.throw(Error);
        });
        it('should return the position of the stop if it is on the route', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: busStops_1.BusRouteName.U1X,
                    position: 4
                },
                {
                    name: busStops_1.BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new busStop_1.BusStop(1, 'Junction Road', location, busRouteData);
            chai_1.expect(busStop.getPositionOfRoute(busStops_1.BusRouteName.U1X)).to.equal(4);
        });
    });
});
//# sourceMappingURL=busStop.spec.js.map