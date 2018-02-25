import {expect} from 'chai';
import {ILocation, Location} from './location';
import {Buses} from './buses';
import {Bus} from './bus';
import 'mocha';
import {Utils} from '../utils/utils';

describe('adding a new bus', () => {
    it('should add new bus', () => {
        const buses = new Buses();
        const location = new Location({latitude: 51.36, longitude: -2.35});

        const bus = buses.newBus(location);
        expect(bus).to.deep.equal(new Bus(0, location));
    });

    it('should return list of Jsoned buses', () => {
        const location0: ILocation = Utils.location.generateValidLocation();
        const location1: ILocation = Utils.location.generateValidLocation();
        const location2: ILocation = Utils.location.generateValidLocation();

        const expectedData = [
            {
                busId: 0,
                location: location0
            },
            {
                busId: 1,
                location: location1
            },
            {
                busId: 2,
                location: location2
            }
        ];

        const buses = new Buses();
        buses.newBus(new Location(location0));
        buses.newBus(new Location(location1));
        buses.newBus(new Location(location2));

        expect(buses.toJson()).to.deep.equal(expectedData);
    });
});
