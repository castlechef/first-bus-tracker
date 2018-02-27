import {expect} from 'chai';
import 'mocha';
import {Bus, busId} from './bus';
import {Utils} from '../utils/utils';
import {Location} from './location';

describe('bus', () => {
    describe('constructor', () => {
        describe('should throw error with invalid id type', () => {
            const location = Utils.location.generateValidLocation();

            const tests = [
                {testName: ' null', id: null},
                {testName: 'n undefined', id: undefined},
                {testName: 'n alphanumeric', id: 'sdfe23'},
                {testName: ' string number', id: '11'},
                {testName: 'n object containing id property', id: {id: 11}}
            ] as {
                testName: string, id: any
            }[];

            tests.forEach(({testName: name, id}) => {
                it(`should throw error with a${name} valued id`, () => {
                    expect(() => new Bus(id, location)).to.throw(Error, 'invalid parameter');
                });
            });
        });

        describe('should throw error with invalid location', () => {
            const validId: busId = 0;

            const tests = [
                {locationType: 'undefined', location: undefined},
                {locationType: 'null', location: null},
                {locationType: 'POJO location', location: Utils.location.generateValidLocation().toJson()},
                {locationType: 'string', location: 'latitude: 12, longitude: 52'}
            ] as {
                locationType: string, location: Location
            }[];

            tests.forEach(({locationType, location}) => {
                it(`should not allow ${locationType} type location`, () => {
                    expect(() => new Bus(validId, location)).to.throw(Error, 'invalid parameter');
                });
            });
        });
    });

    describe('updateLocation', () => {
        describe('should reject invalid locations', () => {
            const validId: busId = 0;
            const bus = new Bus(validId, Utils.location.generateValidLocation());

            const tests = [
                {locationType: 'undefined', location: undefined},
                {locationType: 'null', location: null},
                {locationType: 'POJO location', location: Utils.location.generateValidLocation().toJson()},
                {locationType: 'string', location: 'latitude: 12, longitude: 52'}
            ] as {
                locationType: string, location: Location
            }[];

            tests.forEach(({locationType, location}) => {
                it(`should not allow ${locationType} type location`, () => {
                    expect(() => bus.updateLocation(location)).to.throw(Error, 'invalid location');
                });
            });
        })
    });

    describe('toJson', () => {
        it('should return valid json data of object', () => {
            const validId = 0;
            const validLocation = Utils.location.generateValidLocation();
            const bus = new Bus(validId, validLocation);

            const expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation.latitude,
                    longitude: validLocation.longitude
                }
            };

            expect(bus.toJson()).to.deep.equal(expectedJson);
        });

        it('should return valid json data after location update', () => {
            const validId = 0;
            const validLocation1 = Utils.location.generateValidLocation();
            const validLocation2 = Utils.location.generateValidLocation();
            const bus = new Bus(validId, validLocation1);
            bus.updateLocation(validLocation2);

            const expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation2.latitude,
                    longitude: validLocation2.longitude
                }
            };

            expect(bus.toJson()).to.deep.equal(expectedJson);
        });
    });
});
