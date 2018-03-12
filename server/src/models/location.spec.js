"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const location_1 = require("./location");
require("mocha");
const utils_1 = require("../utils/utils");
describe('location', () => {
    describe('isValidLocation', () => {
        const tests = [
            { name: 'undefined location', args: undefined, expected: false },
            { name: 'null location', args: null, expected: false },
            { name: 'undefined latitude', args: { latitude: undefined, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'undefined longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: undefined }, expected: false },
            { name: 'undefined both', args: { latitude: undefined, longitude: undefined }, expected: false },
            { name: 'boolean latitude', args: { latitude: true, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'boolean longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: true }, expected: false },
            { name: 'boolean both', args: { latitude: false, longitude: false }, expected: false },
            { name: 'string types', args: { latitude: 'hello', longitude: 'world' }, expected: false },
            { name: 'NaN types', args: { latitude: NaN, longitude: NaN }, expected: false },
            { name: 'alphanumeric types', args: { latitude: '2.a34', longitude: '432.sdq3wr' }, expected: false },
            { name: 'out of range latitude', args: { latitude: 48, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'out of range longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: -12.35 }, expected: false },
            { name: 'max boundary latitude', args: { latitude: location_1.Location.MAX_LATITUDE, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'min boundary latitude', args: { latitude: location_1.Location.MIN_LATITUDE, longitude: utils_1.Utils.location.validLon }, expected: false },
            { name: 'max boundary longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: location_1.Location.MAX_LONGITUDE }, expected: false },
            { name: 'min boundary longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: location_1.Location.MIN_LONGITUDE }, expected: false },
            { name: 'min boundary longitude', args: { latitude: utils_1.Utils.location.validLat, longitude: utils_1.Utils.location.validLon }, expected: true },
        ];
        tests.forEach(test => {
            let type = (test.expected) ? 'accepts' : 'rejects';
            it(`${type} ${test.name}`, () => {
                chai_1.expect(location_1.Location.isValidLocation(test.args)).equal(test.expected);
            });
        });
    });
    describe('constructor', () => {
        it('should throw error with undefined ILocations', () => {
            chai_1.expect(() => new location_1.Location(undefined)).throws(Error);
        });
        it('should throw error with null ILocations', () => {
            chai_1.expect(() => new location_1.Location(null)).throws(Error);
        });
    });
    describe('toJSON', () => {
        it('should return json object with correct data', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const jsonLocation = location.toJSON();
            const { latitude, longitude } = location;
            const testData = {
                latitude,
                longitude
            };
            chai_1.expect(jsonLocation).to.deep.equal(testData);
        });
    });
    describe('get latitude/longitude', () => {
        const latitude = utils_1.Utils.location.validLat;
        const longitude = utils_1.Utils.location.validLon;
        const location = new location_1.Location({ latitude, longitude });
        it('should return the latitude provided in the constructor', () => {
            chai_1.expect(location.latitude).to.equal(latitude);
        });
        it('should return the longitude provided in the constructor', () => {
            chai_1.expect(location.longitude).to.equal(longitude);
        });
    });
});
//# sourceMappingURL=location.spec.js.map