import {expect} from 'chai';
import {ILocation, Location} from './location';
import {Buses} from './buses';
import {Bus} from './bus';
import 'mocha';
import {Utils} from '../utils/utils';
import generateValidLocations = Utils.location.generateValidLocations;

let buses;

describe('buses', () => {
    beforeEach(() => {
        buses = new Buses();
    });

    describe('containsBus', () => {
        it('should not contain buses when empty', () => {
            expect(buses.containsBus(0)).to.be.false;
        });

        it('should contain bus after being added', () => {
            const validLocation = Utils.location.generateValidLocation();
            const expectedBusId = 0;

            expect(buses.containsBus(expectedBusId)).to.be.false;
            const bus = buses.createAndInsertBus(validLocation);
            expect(bus.id).to.equal(expectedBusId);
            expect(buses.containsBus(expectedBusId)).to.be.true;
        });

        it('should not contain bus after being removed', () => {
            const validLocation = Utils.location.generateValidLocation();

            expect(buses.containsBus(0)).to.be.false;
            buses.createAndInsertBus(validLocation);
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
            const bus = buses.createAndInsertBus(Utils.location.generateValidLocation());
            expect(buses.getBus(bus.id)).to.deep.equal(bus);
        });
    });

    describe('createAndInsertBus', () => {
        it('should throw error if location is invalid', () => {
            expect(() => buses.createAndInsertBus(undefined)).to.throw(Error, 'invalid parameter');
        });

        it('should return new bus once added', () => {
            const location = Utils.location.generateValidLocation();

            const bus = buses.createAndInsertBus(location);
            expect(bus).to.deep.equal(new Bus(bus.id, location));
        });
    });

    describe('removeAllBuses', () => {
        it('should remove all buses from the list', () => {
            const numberOfBuses = 1000;

            const locations = generateValidLocations(numberOfBuses);
            const bus = [];
            locations.forEach(location => bus.push(buses.createAndInsertBus(location)));
            bus.forEach(bus => expect(buses.containsBus(bus.id)).to.be.true);
            buses.removeAllBuses();
            bus.forEach(bus => expect(buses.containsBus(bus.id)).to.be.false);
        });
    });

    describe('toJson', () => {
        it('should return list of Jsoned buses', () => {
            const location0: Location = Utils.location.generateValidLocation();
            const location1: Location = Utils.location.generateValidLocation();
            const location2: Location = Utils.location.generateValidLocation();

            const expectedData = [
                {
                    busId: 0,
                    location: location0.toJson()
                },
                {
                    busId: 1,
                    location: location1.toJson()
                },
                {
                    busId: 2,
                    location: location2.toJson()
                }
            ];

            buses.createAndInsertBus(location0);
            buses.createAndInsertBus(location1);
            buses.createAndInsertBus(location2);

            expect(buses.toJson()).to.deep.equal(expectedData);
        });

        it('should empty array when empty', () => {
            expect(buses.toJson()).to.deep.equal([]);
        });
    });
});