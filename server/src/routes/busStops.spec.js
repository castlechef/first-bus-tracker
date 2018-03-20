"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const app_1 = require("../app");
const chai_1 = require("chai");
require("mocha");
const utils_1 = require("../utils/utils");
const busStops_1 = require("../models/busStops");
let busStops;
describe('busStops routes', () => {
    beforeEach(() => {
        //
    });
    describe('/busStops [GET]', () => {
        it('should return all bus stops on valid route', () => {
            const busStop1 = {
                'busStopName': 'bus stop 1',
                'location': utils_1.Utils.location.generateValidLocation().toJSON(),
                'routes': [
                    { 'name': 'U1X', 'position': 1 },
                    { 'name': 'U1 City Centre', 'position': 1 },
                    { 'name': 'U1 Bath Abbey', 'position': 1 }
                ]
            };
            const busStop2 = {
                'busStopName': 'bus stop 2',
                'location': utils_1.Utils.location.generateValidLocation().toJSON(),
                'routes': [
                    { 'name': 'U2', 'position': 1 }
                ]
            };
            const busStopsData = [busStop1, busStop2];
            const busStopsTemp = app_1.app.locals.busStops;
            app_1.app.locals.busStops = new busStops_1.BusStops(busStopsData);
            busStop1.busStopId = 0;
            busStop2.busStopId = 1;
            const expectedData = {
                status: 'success',
                data: [
                    busStop1,
                    busStop2
                ]
            };
            return request(app_1.app)
                .get('/busStops')
                .expect(200)
                .then((res) => {
                chai_1.expect(res.body).to.deep.equal(expectedData);
                app_1.app.locals.busStops = busStopsTemp;
            });
        });
    });
    describe('/busStops/{busStopId} [GET]', () => {
        it('should return arrival time at bus stop', () => {
            const routeU2 = app_1.app.locals.busStops.getStopsWithRoute(busStops_1.BusRouteName.U2);
            console.log(routeU2);
            const location0 = routeU2[5].location;
            const location1 = routeU2[6].location;
            const bus = app_1.app.locals.buses.createAndInsertBus(location0, busStops_1.BusRouteName.U2);
            bus.updateLocation(location1);
            return request(app_1.app)
                .get(`/busStops/${routeU2[7].id}`)
                .expect(200)
                .then(res => {
                chai_1.expect(res.body.data.arrivals.length).to.equal(1);
            });
        });
    });
});
//# sourceMappingURL=busStops.spec.js.map