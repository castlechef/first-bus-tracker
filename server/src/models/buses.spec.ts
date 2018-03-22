import {expect} from 'chai';
import {Location} from './location';
import {Buses} from './buses';
import {Bus} from './bus';
import 'mocha';
import {Utils} from '../utils/utils';
import generateValidLocations = Utils.location.generateValidLocations;
import {BusRouteName, BusStops} from './busStops';
import {IBusStop} from './busStop';

let buses, busStops;

describe('buses', () => {
    beforeEach(() => {
        busStops = new BusStops([]);
        buses = new Buses(busStops);
    });

    describe('containsBus', () => {
        it('should not contain buses when empty', () => {
            expect(buses.containsBus(0)).to.be.false;
        });

        it('should contain bus after being added', () => {
            const validLocation = Utils.location.generateValidLocation();
            const expectedBusId = 0;

            expect(buses.containsBus(expectedBusId)).to.be.false;
            const bus = buses.createAndInsertBus(validLocation, BusRouteName.U2);
            expect(bus.id).to.equal(expectedBusId);
            expect(buses.containsBus(expectedBusId)).to.be.true;
        });

        it('should not contain bus after being removed', () => {
            const validLocation = Utils.location.generateValidLocation();

            expect(buses.containsBus(0)).to.be.false;
            buses.createAndInsertBus(validLocation, BusRouteName.U2);
            expect(buses.containsBus(0)).to.be.true;
            buses.removeBus(0);
            expect(buses.containsBus(0)).to.be.false;
        });
    });

    describe('getBus', () => {
        it('should throw an error if the bus has not been inserted', () => {
            expect(() => buses.getBus(0)).to.throw(Error, 'Bus not found');
        });

        it('should return the bus after it has been inserted', () => {
            const bus = buses.createAndInsertBus(Utils.location.generateValidLocation(), BusRouteName.U2);
            expect(buses.getBus(bus.id)).to.deep.equal(bus);
        });
    });

    describe('createAndInsertBus', () => {
        it('should throw error if location is invalid', () => {
            expect(() => buses.createAndInsertBus(undefined, BusRouteName.U2)).to.throw(Error, 'Invalid bus');
        });

        it('should return new bus once added', () => {
            const location = Utils.location.generateValidLocation();

            const bus = buses.createAndInsertBus(location, BusRouteName.U2);
            expect(bus).to.deep.equal(new Bus(bus.id, location, BusRouteName.U2, busStops.getStopsWithRoute(BusRouteName.U2)));
        });
    });

    describe('removeAllBuses', () => {
        it('should remove all buses from the list', () => {
            const numberOfBuses = 1000;

            const locations = generateValidLocations(numberOfBuses);
            const bus = [];
            locations.forEach(location => bus.push(buses.createAndInsertBus(location, BusRouteName.U2)));
            bus.forEach(bus => expect(buses.containsBus(bus.id)).to.be.true);
            buses.removeAllBuses();
            bus.forEach(bus => expect(buses.containsBus(bus.id)).to.be.false);
        });
    });

    describe('toJSON', () => {
        it('should return list of Jsoned buses', () => {
            const location0: Location = Utils.location.generateValidLocation();
            const location1: Location = Utils.location.generateValidLocation();
            const location2: Location = Utils.location.generateValidLocation();

            const expectedData = [
                {
                    busId: 0,
                    location: location0.toJSON(),
                    routeName: BusRouteName.U1X
                },
                {
                    busId: 1,
                    location: location1.toJSON(),
                    routeName: BusRouteName.U1X
                },
                {
                    busId: 2,
                    location: location2.toJSON(),
                    routeName: BusRouteName.U1X
                }
            ];

            buses.createAndInsertBus(location0, BusRouteName.U1X);
            buses.createAndInsertBus(location1, BusRouteName.U1X);
            buses.createAndInsertBus(location2, BusRouteName.U1X);

            expect(buses.toJSON()).to.deep.equal(expectedData);
        });

        it('should empty array when empty', () => {
            expect(buses.toJSON()).to.deep.equal([]);
        });
    });

    describe('getExpectedArrivalsAtStop', () => {
        const data: { busStops: IBusStop[] } = require('../../data.json');
        const busStops = new BusStops(data.busStops);
        buses = new Buses(busStops);

        it('Should return arrival times of 2 buses', () => {
            const data: { busStops: IBusStop[] } = require('../../data.json');
            const busStops = new BusStops(data.busStops);
            const routeU2 = busStops.getStopsWithRoute(BusRouteName.U2);
            buses = new Buses(busStops);

            let bus0 = buses.createAndInsertBus(routeU2[0].location, BusRouteName.U2);
            let bus1 = buses.createAndInsertBus(routeU2[6].location, BusRouteName.U2);

            bus0.updateLocation(routeU2[1].location);
            bus1.updateLocation(routeU2[7].location);

            bus0.updateLocation(routeU2[2].location);
            bus1.updateLocation(routeU2[8].location);
        });
    });
});