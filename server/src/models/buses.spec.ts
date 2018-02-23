import {expect} from 'chai';
import {ILocation, Location} from './location';
import {Buses} from './buses';
import {Bus} from './bus';
import 'mocha';

describe('adding a new bus', () => {
    it('should add new bus', () => {
        const buses = new Buses();
        const location = new Location({latitude: 52.36, longitude: -2.35});

        const bus = buses.newBus(location);
        expect(bus).to.deep.equal(new Bus(0, location));
    });

    it('should return list of Jsoned buses', () => {
        const location0: ILocation = generateValidLocation();
        const location1: ILocation = generateValidLocation();
        const location2: ILocation = generateValidLocation();

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


function generateValidLocation(): ILocation {
    const latitude = (Math.random() * Location.MAX_LATITUDE) + Location.MIN_LATITUDE;
    const longitude = (Math.random() * Location.MAX_LONGITUDE) + Location.MIN_LONGITUDE;
    return {
        latitude,
        longitude
    };
}
