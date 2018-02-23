import {expect} from 'chai';
import {Location} from './location';
import 'mocha';

describe('Locations', () => {

    describe('isValidLocation', () => {

        const validLat = (Location.MIN_LATITUDE + Location.MAX_LATITUDE) / 2;
        const validLon = (Location.MIN_LONGITUDE + Location.MAX_LONGITUDE) / 2;

        const tests = [
            { name: 'undefined latitude', args: {latitude: undefined, longitude: validLon}, expected: false },
            { name: 'undefined longitude', args: {latitude: validLat, longitude: undefined}, expected: false },
            { name: 'undefined both', args: {latitude: undefined, longitude: undefined}, expected: false },
            { name: 'boolean latitude', args: {latitude: true, longitude: validLon}, expected: false },
            { name: 'boolean longitude', args: {latitude: validLat, longitude: true}, expected: false },
            { name: 'boolean both', args: {latitude: false, longitude: false}, expected: false },
            { name: 'string types', args: {latitude: 'hello', longitude: 'world'}, expected: false },
            { name: 'NaN types', args: {latitude: NaN, longitude: NaN}, expected: false },
            { name: 'alphanumeric types', args: {latitude: '2.a34', longitude: '432.sdq3wr'}, expected: false },
            { name: 'out of range latitude', args: {latitude: 48, longitude: validLon}, expected: false },
            { name: 'out of range longitude', args: {latitude: validLat, longitude: -12.35}, expected: false },
            { name: 'max boundary latitude', args: {latitude: Location.MAX_LATITUDE, longitude: validLon}, expected: false },
            { name: 'min boundary latitude', args: {latitude: Location.MIN_LATITUDE, longitude: validLon}, expected: false },
            { name: 'max boundary longitude', args: {latitude: validLat, longitude: Location.MAX_LONGITUDE}, expected: false },
            { name: 'min boundary longitude', args: {latitude: validLat, longitude: Location.MIN_LONGITUDE}, expected: false },
            { name: 'min boundary longitude', args: {latitude: validLat, longitude: validLon}, expected: true },
        ];

        tests.forEach(test => {
            let type = (test.expected) ? 'accepts' : 'rejects';
            it(`${type} ${test.name}`, () => {
                expect(Location.isValidLocation(test.args)).equal(test.expected);
            });
        });

    });

    describe('toJson', () => {
        it('should be sensible', () => {
            const location = new Location({latitude: 52.36, longitude: -2.35});
            const jsonLocation = location.toJson();
            const testData = {
                latitude: 52.36,
                longitude: -2.35
            };

            expect(jsonLocation).to.deep.equal(testData);
        });
    });
});
