import {expect} from 'chai';
import 'mocha';
import {Bus, busId} from './bus';
import {Utils} from '../utils/utils';
import {Location} from './location';
import {BusRouteName, BusStops} from './busStops';
import {busStops} from '../app';
import {IBusStop} from './busStop';
import generateValidLocation = Utils.location.generateValidLocation;

describe('bus', () => {


    describe('constructor', () => {
        describe('should throw error when invalid bus route', () => {
            it('should not accept names which are not in BusRouteNames', () => {
                const location = generateValidLocation();
                const busRouteName = 'Jonny\'s Route' as BusRouteName;

                expect(() => new Bus(0, location, busRouteName, busStops.getStopsWithRoute(busRouteName))).to.throw(Error);
            });

            it('should not accept missing bus route name', () => {
                const location = generateValidLocation();
                const busRouteName = undefined as BusRouteName;

                expect(() => new Bus(0, location, busRouteName, busStops.getStopsWithRoute(busRouteName))).to.throw(Error);
            });
        });

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
                    expect(() => new Bus(id, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2))).to.throw(Error, 'invalid parameter');
                });
            });
        });

        describe('should throw error with invalid location', () => {

            const validId: busId = 0;

            const tests = [
                {locationType: 'undefined', location: undefined},
                {locationType: 'null', location: null},
                {locationType: 'POJO location', location: Utils.location.generateValidLocation().toJSON()},
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
            const data: { busStops: IBusStop[] } = require('../../data.json');
            const busStops = new BusStops(data.busStops);

            const validId: busId = 0;
            const bus = new Bus(validId, Utils.location.generateValidLocation(), BusRouteName.U1, busStops.getStopsWithRoute(BusRouteName.U1));

            const tests = [
                {locationType: 'undefined', location: undefined},
                {locationType: 'null', location: null},
                {locationType: 'POJO location', location: Utils.location.generateValidLocation().toJSON()},
                {locationType: 'string', location: 'latitude: 12, longitude: 52'}
            ] as {
                locationType: string, location: Location
            }[];

            tests.forEach(({locationType, location}) => {
                it(`should not allow ${locationType} type location`, () => {
                    expect(() => bus.updateLocation(location)).to.throw(Error, 'invalid location');
                });
            });
        });

        describe('predicting arrival times', () => {
            let busStops;

            beforeEach(() => {
                const data: { busStops: IBusStop[] } = require('../../data.json');
                busStops = new BusStops(data.busStops);
            });

            it('should reduce arrival time of the next stop when moving towards next stop', () => {
                let distance0 = 56.53; // bus-shaft
                let distance1 = 229.4; // shaft-tyning
                let distance2 = 271.7; // tyning-hadley
                let distance3 = 207.1; // hadley-firs
                let totalExpectedDistance = distance0 + distance1 + distance2 + distance3;
                const busLocation0 = new Location({latitude: 51.3653829, longitude: -2.3218583});
                const busLocation1 = new Location({latitude: 51.3637848, longitude: -2.3310113});
                const busLocation2 = new Location({latitude: 51.363064, longitude: -2.338306});
                const bus = new Bus(0, busLocation0, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));
                bus.updateLocation(busLocation1);
                bus.updateLocation(busLocation2);
            });
        });
    });

    describe('toJSON', () => {
        it('should return valid json data of object', () => {
            const validId = 0;
            const validLocation = Utils.location.generateValidLocation();
            const bus = new Bus(validId, validLocation, BusRouteName.U1_ABBEY, busStops.getStopsWithRoute(BusRouteName.U1_ABBEY));

            const expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation.latitude,
                    longitude: validLocation.longitude
                },
                routeName: BusRouteName.U1_ABBEY
            };

            expect(bus.toJSON()).to.deep.equal(expectedJson);
        });

        it('should return valid json data after location update', () => {
            const validId = 0;
            const validLocation1 = Utils.location.generateValidLocation();
            const validLocation2 = Utils.location.generateValidLocation();
            const bus = new Bus(validId, validLocation1, BusRouteName.U1_CITY, busStops.getStopsWithRoute(BusRouteName.U1_CITY));
            bus.updateLocation(validLocation2);

            const expectedJson = {
                busId: validId,
                location: {
                    latitude: validLocation2.latitude,
                    longitude: validLocation2.longitude
                },
                routeName: BusRouteName.U1_CITY
            };

            expect(bus.toJSON()).to.deep.equal(expectedJson);
        });
    });

    describe('getNearestStop', () => {
        it('should return nearest bus stop', () => {
            const location = new Location({latitude: 51.359261, longitude: -2.357102});
            const expectedStopName = 'Foxhill House';

            const data: { busStops: IBusStop[] } = require('../../data.json');
            const busStops = new BusStops(data.busStops);

            const bus = new Bus(0, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));

            expect(bus.getNearestStop().name).to.equal(expectedStopName);
        });
    });

    describe('getDistanceToNearestStop', () => {
        it('should calculate distance to nearest stop within 5 percent', () => {
            const location = new Location({latitude: 51.359261, longitude: -2.357102});

            const bus = new Bus(0, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));
            const expectedDist = 20.43;

            expect(bus.getDistanceToNearestStop()).to.be.within(expectedDist * 0.95, expectedDist * 1.05);
        });
    });

    describe('getStopsWithinRange', () => {
        let busStops;

        beforeEach(() => {
            const data: { busStops: IBusStop[] } = require('../../data.json');
            busStops = new BusStops(data.busStops);
        });

        it('should return stops within a given range (1 stop)', () => {
            const location = new Location({latitude: 51.359261, longitude: -2.357102});
            const expectedStopName = 'Foxhill House';

            const bus = new Bus(0, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));

            expect(bus.getStopsWithinRange(25).length).to.equal(1);
            expect(bus.getStopsWithinRange(25)[0].name).to.equal(expectedStopName);
        });

        it('should return stops within a given range (2 stops)', () => {
            const location = new Location({latitude: 51.359261, longitude: -2.357102});

            const bus = new Bus(0, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));

            expect(bus.getStopsWithinRange(160).length).to.equal(2);
        });

        it('should return stops within a given range (whole route)', () => {
            const location = new Location({latitude: 51.359261, longitude: -2.357102});

            const bus = new Bus(0, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));

            expect(bus.getStopsWithinRange(100000).length).to.equal(busStops.getStopsWithRoute(BusRouteName.U2).length);
        });
    });

    describe('getNextBusStop', () => {
        let busStops;

        beforeEach(() => {
            const data: { busStops: IBusStop[] } = require('../../data.json');
            busStops = new BusStops(data.busStops);
        });

        it('should not have next bus stop from single location', () => {
            const location = new Location({latitude: 51.359261, longitude: -2.357102});

            const bus = new Bus(0, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));

            expect(bus.getNextBusStop()).to.equal(undefined);
        });

        it('should not have next bus stop from location not passing 2 consecutive bus stops', () => {
            const location1 = new Location({latitude: 51.359261, longitude: -2.357102});
            const location2 = new Location({latitude: 51.359164, longitude: -2.357821});

            const bus = new Bus(0, location1, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));
            bus.updateLocation(location2);

            expect(bus.getNextBusStop()).to.equal(undefined);
        });

        it('should not have next bus stop after passing 1 bus stop', () => {
            const location1 = busStops.getStopsWithRoute(BusRouteName.U2)[0].location;
            const location2 = new Location({latitude: 51.359164, longitude: -2.357821});

            const bus = new Bus(0, location1, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));
            bus.updateLocation(location2);

            expect(bus.getNextBusStop()).to.equal(undefined);
        });

        it('should have next bus stop (uni-directional)', () => {
            const location1 = busStops.getStopsWithRoute(BusRouteName.U2)[12].location;
            const location2 = busStops.getStopsWithRoute(BusRouteName.U2)[13].location;

            const bus = new Bus(0, location1, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));
            bus.updateLocation(location2);

            expect(bus.getNextBusStop().name).to.equal(busStops.getStopsWithRoute(BusRouteName.U2)[14].name);
        });

        it('should have next bus stop (bi-directional)', () => {
            const locations: Location[] = [
                new Location({latitude: 51.377790, longitude: -2.337564}),
                new Location({latitude: 51.377839, longitude: -2.337973}),
                new Location({latitude: 51.378513, longitude: -2.339961}),
                new Location({latitude: 51.378719, longitude: -2.340343})
            ];
            const bus = new Bus(0, locations[0], BusRouteName.U1, busStops.getStopsWithRoute(BusRouteName.U1));
            expect(bus.getNextBusStop()).to.equal(undefined);

            bus.updateLocation(locations[1]);
            expect(bus.getNextBusStop()).to.equal(undefined);

            bus.updateLocation(locations[2]);
            expect(bus.getNextBusStop()).to.equal(undefined);

            bus.updateLocation(locations[3]);
            expect(bus.getNextBusStop().name).to.equal('White Lodge (Westbound)');
        });

        it('should have next bus stop (bi-directional)', () => {
            const locations: Location[] = [
                new Location({latitude: 51.377790, longitude: -2.337564}),
                new Location({latitude: 51.377839, longitude: -2.337973}),
                new Location({latitude: 51.378513, longitude: -2.339961}),
                new Location({latitude: 51.378719, longitude: -2.340343})
            ];
            const bus = new Bus(0, locations[3], BusRouteName.U1, busStops.getStopsWithRoute(BusRouteName.U1));
            expect(bus.getNextBusStop()).to.equal(undefined);

            bus.updateLocation(locations[2]);
            expect(bus.getNextBusStop()).to.equal(undefined);

            bus.updateLocation(locations[1]);
            expect(bus.getNextBusStop()).to.equal(undefined);

            bus.updateLocation(locations[0]);
            expect(bus.getNextBusStop().name).to.equal('Woodland Place (Eastbound)');
        });
    });

    describe('getDistanceToStop', () => {
        let busStops;

        beforeEach(() => {
            const data: { busStops: IBusStop[] } = require('../../data.json');
            busStops = new BusStops(data.busStops);
        });

        it('should calculate the distance to a given bus stop, 3 stops away', () => {
            let distance0 = 56.53; // bus-shaft
            let distance1 = 229.4; // shaft-tyning
            let distance2 = 271.7; // tyning-hadley
            let distance3 = 207.1; // hadley-firs
            let totalExpectedDistance = distance0 + distance1 + distance2 + distance3;
            const busLocation0 = new Location({latitude: 51.3653829, longitude: -2.3218583});
            const busLocation1 = new Location({latitude: 51.3637848, longitude: -2.3310113});
            const busLocation2 = new Location({latitude: 51.363064, longitude: -2.338306});
            const bus = new Bus(0, busLocation0, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));
            bus.updateLocation(busLocation1);
            bus.updateLocation(busLocation2);

            expect(bus.getDistanceToStop(busStops.getStopsWithRoute(BusRouteName.U2)[9])).to.be.within(totalExpectedDistance*0.95, totalExpectedDistance*1.05)
        });
    });

    describe('getBusStopAfterStop', () => {
        let busStops;

        beforeEach(() => {
            const data: { busStops: IBusStop[] } = require('../../data.json');
            busStops = new BusStops(data.busStops);
        });

        it('should return the third stop, when the bus has passed the first and second', () => {
            const routeU2 = busStops.getStopsWithRoute(BusRouteName.U2);

            const bus = new Bus(0, routeU2[0].location, BusRouteName.U2, routeU2);
            bus.updateLocation(routeU2[1].location);

            expect(bus.getBusStopAfterStop(routeU2[1])).to.equal(routeU2[2]);
        });

        it('should return the first stop after reaching the last stop', () => {
            const routeU2 = busStops.getStopsWithRoute(BusRouteName.U2);

            const bus = new Bus(0, routeU2[routeU2.length - 2].location, BusRouteName.U2, routeU2);
            bus.updateLocation(routeU2[routeU2.length - 1].location);

            expect(bus.getBusStopAfterStop(routeU2[routeU2.length - 1])).to.equal(routeU2[0]);
        });
    });

    describe('getNumberOfStopsUntilStop', () => {
        let busStops;

        beforeEach(() => {
            const data: { busStops: IBusStop[] } = require('../../data.json');
            busStops = new BusStops(data.busStops);
        });

        it('should throw an error when the bus has not established a route', () => {
            const bus = new Bus(0, generateValidLocation(), BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2));
            const busStopThatIsOnRoute = busStops.getStopsWithRoute(BusRouteName.U2)[0];

            expect(() => bus.getNumberOfStopsUntilStop(busStopThatIsOnRoute)).to.throw(Error, 'Bus route position not established');
        });

        it('should throw an error when the bus stop is not on the route', () => {
            const routeU2 = busStops.getStopsWithRoute(BusRouteName.U2);

            const bus = new Bus(0, routeU2[0].location, BusRouteName.U2, routeU2);
            bus.updateLocation(routeU2[1].location);
            const busStopThatIsOnRoute = busStops.getStopsWithRoute(BusRouteName.U1)[9];

            expect(() => bus.getNumberOfStopsUntilStop(busStopThatIsOnRoute)).to.throw(Error, 'Bus stop not on route');
        });

        it('should return 1 for the next stop', () => {
            const routeU2 = busStops.getStopsWithRoute(BusRouteName.U2);

            const bus = new Bus(0, routeU2[0].location, BusRouteName.U2, routeU2);
            bus.updateLocation(routeU2[1].location);

            expect(bus.getNumberOfStopsUntilStop(routeU2[2])).to.equal(1);
        });

        it('should return the length of the route for the previous bus stop', () => {
            const routeU2 = busStops.getStopsWithRoute(BusRouteName.U2);

            const bus = new Bus(0, routeU2[0].location, BusRouteName.U2, routeU2);
            bus.updateLocation(routeU2[1].location);

            expect(bus.getNumberOfStopsUntilStop(routeU2[1])).to.equal(routeU2.length);
        });
    });
});

