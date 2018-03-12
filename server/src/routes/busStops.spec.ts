import * as request from 'supertest';
import {app} from '../app';
import {expect} from 'chai';
import 'mocha';
import {Utils} from '../utils/utils';
import {BusStops} from '../models/busStops';
import {IBusStop} from '../models/busStop';

let busStops: BusStops;

describe('busStops routes', () => {
    beforeEach(() => {
        //
    });

    describe('/busStops [GET]', () => {
        it('should return all bus stops on valid route', () => {
            const busStop1 = {
                'busStopName': 'bus stop 1',
                'location': Utils.location.generateValidLocation().toJSON(),
                'routes': [
                    {'name': 'U1X', 'position': 1},
                    {'name': 'U1 City Centre', 'position': 1},
                    {'name': 'U1 Bath Abbey', 'position': 1}
                ]
            };
            const busStop2 = {
                'busStopName': 'bus stop 2',
                'location': Utils.location.generateValidLocation().toJSON(),
                'routes': [
                    {'name': 'U2', 'position': 1}
                ]
            };
            const busStopsData = [busStop1, busStop2] as IBusStop[];
            app.locals.busStops = new BusStops(busStopsData);
            busStop1.busStopId = 0;
            busStop2.busStopId = 1;
            const expectedData = {
                status: 'success',
                data: [
                    busStop1,
                    busStop2
                ]
            };

            return request(app)
                .get('/busStops')
                .expect(200)
                .then((res) => {
                    expect(res.body).to.deep.equal(expectedData)
                });
        });
    });
});