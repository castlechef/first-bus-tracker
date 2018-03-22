import * as request from 'supertest';
import {app} from '../app';
import {expect} from 'chai';
import 'mocha';
import {Utils} from '../utils/utils';
import {BusRouteName, BusStops} from '../models/busStops';
import {IBusStop} from '../models/busStop';
import {Location} from '../models/location';

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
            const busStopsTemp = app.locals.busStops;
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
                    expect(res.body).to.deep.equal(expectedData);
                    app.locals.busStops = busStopsTemp;
                });
        });
    });

    describe('/busStops/{busStopId} [GET]', () => {
        it('should return arrival time at bus stop', () => {
            const routeU2 = app.locals.busStops.getStopsWithRoute(BusRouteName.U2);
            const location0 = routeU2[5].location;
            const location1 = routeU2[6].location;

            const bus = app.locals.buses.createAndInsertBus(location0, BusRouteName.U2);
            bus.updateLocation(location1);

            return request(app)
                .get(`/busStops/${routeU2[7].id}`)
                .expect(200)
                .then(res => {
                    expect(res.body.data.arrivals.length).to.equal(1);
                });
        });
    });
});