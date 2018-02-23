import {expect} from 'chai';
import {} from 'mocha';
import {Location} from './location';
import {Bus} from './bus';

describe('adding a new bus', () => {
    it('should be sensible', () => {
        const location = new Location({latitude: 52.36, longitude: -2.35});
        const bus = new Bus(0, location);
        const jsonLocation = bus.toJson();
        const testData = {
            busId: 0,
            location: {
                latitude: 52.36,
                longitude: -2.35
            }
        };

        expect(jsonLocation).to.deep.equal(testData);
    });
});
