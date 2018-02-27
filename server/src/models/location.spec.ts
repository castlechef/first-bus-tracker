import {assert, expect} from 'chai';
import {ILocation, Location} from './location';
import 'mocha';
import {Utils} from '../utils/utils';

describe('location', () => {
    describe('isValidLocation', () => {

        const tests = [
            {name: 'undefined latitude', args: {latitude: undefined, longitude: Utils.location.validLon}, expected: false},
            {name: 'undefined longitude', args: {latitude: Utils.location.validLat, longitude: undefined}, expected: false},
            {name: 'undefined both', args: {latitude: undefined, longitude: undefined}, expected: false},
            {name: 'boolean latitude', args: {latitude: true, longitude: Utils.location.validLon}, expected: false},
            {name: 'boolean longitude', args: {latitude: Utils.location.validLat, longitude: true}, expected: false},
            {name: 'boolean both', args: {latitude: false, longitude: false}, expected: false},
            {name: 'string types', args: {latitude: 'hello', longitude: 'world'}, expected: false},
            {name: 'NaN types', args: {latitude: NaN, longitude: NaN}, expected: false},
            {name: 'alphanumeric types', args: {latitude: '2.a34', longitude: '432.sdq3wr'}, expected: false},
            {name: 'out of range latitude', args: {latitude: 48, longitude: Utils.location.validLon}, expected: false},
            {name: 'out of range longitude', args: {latitude: Utils.location.validLat, longitude: -12.35}, expected: false},
            {name: 'max boundary latitude', args: {latitude: Location.MAX_LATITUDE, longitude: Utils.location.validLon}, expected: false},
            {name: 'min boundary latitude', args: {latitude: Location.MIN_LATITUDE, longitude: Utils.location.validLon}, expected: false},
            {name: 'max boundary longitude', args: {latitude: Utils.location.validLat, longitude: Location.MAX_LONGITUDE}, expected: false},
            {name: 'min boundary longitude', args: {latitude: Utils.location.validLat, longitude: Location.MIN_LONGITUDE}, expected: false},
            {name: 'min boundary longitude', args: {latitude: Utils.location.validLat, longitude: Utils.location.validLon}, expected: true},
        ] as {
            name: string, args: ILocation, expected: boolean
        }[];

        tests.forEach(test => {
            let type = (test.expected) ? 'accepts' : 'rejects';
            it(`${type} ${test.name}`, () => {
                expect(Location.isValidLocation(test.args)).equal(test.expected);
            });
        });

        it('throws property error when undefined object sent', () => {
            assert.throws(() => {
                Location.isValidLocation(undefined)
            }, Error, 'Cannot read property \'latitude\' of undefined');
        });

        it('throws property error when null object sent', () => {
            assert.throws(() => {
                Location.isValidLocation(null);
            }, Error, 'Cannot read property \'latitude\' of null');
        });


    });

    describe('constructor', () => {
        it('should throw error with undefined ILocations', () => {
            expect(() => new Location(undefined)).throws(Error);
        });

        it('should throw error with null ILocations', () => {
            expect(() => new Location(null)).throws(Error);
        });
    });

    describe('toJson', () => {
        it('should return json object with correct data', () => {
            const location = Utils.location.generateValidLocation();
            const jsonLocation = location.toJson();
            const {latitude, longitude} = location;

            const testData = {
                latitude,
                longitude
            };

            expect(jsonLocation).to.deep.equal(testData);
        });
    });

    describe('get latitude/longitude', () => {
        const latitude = Utils.location.validLat;
        const longitude = Utils.location.validLon;

        const location = new Location({latitude, longitude});

        it('should return the latitude provided in the constructor', () => {
            expect(location.latitude).to.equal(latitude);
        });

        it('should return the longitude provided in the constructor', () => {
            expect(location.longitude).to.equal(longitude);
        });
    });
});
