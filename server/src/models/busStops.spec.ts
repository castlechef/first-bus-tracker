import {BusRouteName, BusStops} from './busStops';
import {expect} from 'chai';

describe('BusStops', () => {
    describe('getStopsWithRoute method', () => {
        it('should get all stops on a given route', () => {
            const data = [
                {
                    'name': 'bus stop 1',
                    'location': {
                        'latitude': 51.3553,
                        'longitude': -2.395
                    },
                    'routes': [
                        {'name': 'U2', 'position': 1}
                    ]
                },
                {
                    'name': 'bus stop 2',
                    'location': {
                        'latitude': 51.3554,
                        'longitude': -2.39
                    },
                    'routes': [
                        {'name': 'U2', 'position': 2}
                    ]
                }
            ];
            const busStops = new BusStops(data);

            expect(busStops.getStopsWithRoute(BusRouteName.U2).length).to.deep.equal(data.length);
        });
    });
});