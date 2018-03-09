"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const bus_1 = require("./bus");
const utils_1 = require("../utils/utils");
const busStops_1 = require("./busStops");
describe('bus', () => {
    describe('constructor', () => {
        describe('should throw error with invalid id type', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const tests = [
                { testName: ' null', id: null },
                { testName: 'n undefined', id: undefined },
                { testName: 'n alphanumeric', id: 'sdfe23' },
                { testName: ' string number', id: '11' },
                { testName: 'n object containing id property', id: { id: 11 } }
            ];
            tests.forEach(({ testName: name, id }) => {
                it(`should throw error with a${name} valued id`, () => {
                    chai_1.expect(() => new bus_1.Bus(id, location)).to.throw(Error, 'invalid parameter');
                });
            });
        });
        describe('should throw error with invalid location', () => {
            const validId = 0;
            const tests = [
                { locationType: 'undefined', location: undefined },
                { locationType: 'null', location: null },
                { locationType: 'POJO location', location: utils_1.Utils.location.generateValidLocation().toJSON() },
                { locationType: 'string', location: 'latitude: 12, longitude: 52' }
            ];
            tests.forEach(({ locationType, location }) => {
                it(`should not allow ${locationType} type location`, () => {
                    chai_1.expect(() => new bus_1.Bus(validId, location)).to.throw(Error, 'invalid parameter');
                });
            });
        });
    });
    describe('updateLocation', () => {
        describe('should reject invalid locations', () => {
            const validId = 0;
            const bus = new bus_1.Bus(validId, utils_1.Utils.location.generateValidLocation());
            const tests = [
                { locationType: 'undefined', location: undefined },
                { locationType: 'null', location: null },
                { locationType: 'POJO location', location: utils_1.Utils.location.generateValidLocation().toJSON() },
                { locationType: 'string', location: 'latitude: 12, longitude: 52' }
            ];
            tests.forEach(({ locationType, location }) => {
                it(`should not allow ${locationType} type location`, () => {
                    chai_1.expect(() => bus.updateLocation(location)).to.throw(Error, 'invalid location');
                });
            });
        });
    });
    describe('toJSON', () => {
        it('should return valid json data of object', () => {
            const validId = 0;
            const validLocation = utils_1.Utils.location.generateValidLocation();
            const bus = new bus_1.Bus(validId, validLocation, busStops_1.BusRouteName.U1_ABBEY);
            const expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation.latitude,
                    longitude: validLocation.longitude
                },
                routeName: busStops_1.BusRouteName.U1_ABBEY
            };
            chai_1.expect(bus.toJSON()).to.deep.equal(expectedJson);
        });
        it('should return valid json data after location update', () => {
            const validId = 0;
            const validLocation1 = utils_1.Utils.location.generateValidLocation();
            const validLocation2 = utils_1.Utils.location.generateValidLocation();
            const bus = new bus_1.Bus(validId, validLocation1, busStops_1.BusRouteName.U1_CITY);
            bus.updateLocation(validLocation2);
            const expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation2.latitude,
                    longitude: validLocation2.longitude
                },
                routeName: busStops_1.BusRouteName.U1_CITY
            };
            chai_1.expect(bus.toJSON()).to.deep.equal(expectedJson);
        });
    });
});
//# sourceMappingURL=bus.spec.js.map