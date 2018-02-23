import {expect} from 'chai';
import {Location} from './location';

describe('adding a new bus', () => {
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
