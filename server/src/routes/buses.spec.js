"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const app_1 = require("../app");
const chai_1 = require("chai");
require("mocha");
const utils_1 = require("../utils/utils");
const busStops_1 = require("../models/busStops");
const location_1 = require("../models/location");
let buses;
describe('buses routes', () => {
    beforeEach(() => {
        buses = app_1.app.locals.buses;
        buses.removeAllBuses();
    });
    describe('/buses [POST]', () => {
        it('dodgy location data', () => {
            const data = {
                data: {
                    location: {
                        latitude: 'asdf',
                        longitude: false
                    },
                    routeName: busStops_1.BusRouteName.U1X
                }
            };
            return request(app_1.app)
                .post('/buses')
                .send(data)
                .expect(422)
                .then((res) => {
                chai_1.expect(res.body.error.code).to.equal(422);
            });
        });
        it('dodgy route name', () => {
            const data = {
                data: {
                    location: utils_1.Utils.location.generateValidLocation().toJSON(),
                    routeName: "Fail please"
                }
            };
            return request(app_1.app)
                .post('/buses')
                .send(data)
                .expect(422)
                .then((res) => {
                chai_1.expect(res.body.error.code).to.equal(422);
            });
        });
        it('should add new bus', () => {
            const data = {
                data: {
                    location: utils_1.Utils.location.generateValidLocation().toJSON(),
                    routeName: busStops_1.BusRouteName.U1X
                }
            };
            return request(app_1.app)
                .post('/buses')
                .send(data)
                .expect(200)
                .then((res) => {
                chai_1.expect(res.body.data.busId).to.equal(0);
            });
        });
    });
    describe('/buses [GET]', () => {
        it('should return list of buses', () => {
            const location0 = utils_1.Utils.location.generateValidLocation();
            const location1 = utils_1.Utils.location.generateValidLocation();
            const location2 = utils_1.Utils.location.generateValidLocation();
            const expectedData = {
                'status': 'success',
                'data': [
                    {
                        'busId': 0,
                        'location': location0.toJSON(),
                        'routeName': busStops_1.BusRouteName.U1_OLDFIELD
                    },
                    {
                        'busId': 1,
                        'location': location1.toJSON(),
                        'routeName': busStops_1.BusRouteName.U2
                    },
                    {
                        'busId': 2,
                        'location': location2.toJSON(),
                        'routeName': busStops_1.BusRouteName.U1X
                    }
                ]
            };
            const buses = app_1.app.locals.buses;
            buses.createAndInsertBus(location0, busStops_1.BusRouteName.U1_OLDFIELD);
            buses.createAndInsertBus(location1, busStops_1.BusRouteName.U2);
            buses.createAndInsertBus(location2, busStops_1.BusRouteName.U1X);
            return request(app_1.app).get('/buses')
                .expect(200)
                .then(res => {
                chai_1.expect(res.body).to.deep.equal(expectedData);
            });
        });
    });
    describe('/buses/{busId} [GET]', () => {
        it('should return empty arrival times when bus route is not established', () => {
            const location = new location_1.Location({ latitude: 51.362944, longitude: -2.339107 });
            const routeName = busStops_1.BusRouteName.U2;
            const bus = app_1.app.locals.buses.createAndInsertBus(location, routeName);
            return request(app_1.app)
                .get(`/buses/${bus.id}`)
                .expect(200)
                .then(res => {
                const data = res.body.data;
                const expectedData = {
                    busId: bus.id,
                    location: location.toJSON(),
                    routeName,
                    departureTimes: [],
                    arrivalTimes: []
                };
                chai_1.expect(data).to.deep.equal(expectedData);
            });
        });
        it('should return 10 next arrival times and 2 latest departure times once bus is established', () => {
            const location = new location_1.Location({ latitude: 51.362944, longitude: -2.339107 });
            const location2 = new location_1.Location({ latitude: 51.362587, longitude: -2.342343 });
            const routeName = busStops_1.BusRouteName.U2;
            const bus = app_1.app.locals.buses.createAndInsertBus(location, routeName);
            bus.updateLocation(location2);
            return request(app_1.app)
                .get(`/buses/${bus.id}`)
                .expect(200)
                .then(res => {
                const data = res.body.data;
                chai_1.expect(data.arrivalTimes.length).to.equal(10);
                chai_1.expect(data.departureTimes.length).to.equal(2);
            });
        });
        it('should return 10 next arrival times and most recent 2 departure times after more than 2 departures', () => {
            const location = new location_1.Location({ latitude: 51.362944, longitude: -2.339107 });
            const location1 = new location_1.Location({ latitude: 51.362587, longitude: -2.342343 });
            const location2 = new location_1.Location({ latitude: 51.362089, longitude: -2.346247 });
            const routeName = busStops_1.BusRouteName.U2;
            const bus = app_1.app.locals.buses.createAndInsertBus(location, routeName);
            bus.updateLocation(location1);
            bus.updateLocation(location2);
            return request(app_1.app)
                .get(`/buses/${bus.id}`)
                .expect(200)
                .then(res => {
                const data = res.body.data;
                chai_1.expect(data.arrivalTimes.length).to.equal(10);
                chai_1.expect(data.departureTimes.length).to.equal(2);
            });
        });
    });
    describe('/buses/{busId} [PUT]', () => {
        it('should respond with 200 response when location and busId are valid', () => {
            const initialLocation = utils_1.Utils.location.generateValidLocation();
            const updatedLocation = utils_1.Utils.location.generateValidLocation();
            const bus = app_1.app.locals.buses.createAndInsertBus(initialLocation, busStops_1.BusRouteName.U2);
            const dataToSend = {
                data: {
                    location: {
                        latitude: updatedLocation.latitude,
                        longitude: updatedLocation.longitude
                    }
                }
            };
            const expectedData = {
                status: 'success',
                data: {
                    busId: bus.id,
                    location: {
                        latitude: updatedLocation.latitude,
                        longitude: updatedLocation.longitude
                    },
                    routeName: busStops_1.BusRouteName.U2
                }
            };
            return request(app_1.app)
                .put(`/buses/${bus.id}`)
                .send(dataToSend)
                .expect(200)
                .then(res => {
                chai_1.expect(res.body).to.deep.equal(expectedData);
            });
        });
        it('should respond with 404 error when bus with id has been deleted', () => {
            const location = utils_1.Utils.location.generateValidLocation();
            const bus = buses.createAndInsertBus(location, busStops_1.BusRouteName.U2);
            buses.removeBus(bus.id);
            return request(app_1.app)
                .put(`/buses/${bus.id}`)
                .send({ data: { location: location.toJSON() } })
                .expect(404)
                .then(res => {
                chai_1.expect(res.body).to.deep.equal({
                    status: 'failure',
                    data: {
                        busId: bus.id,
                        location: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    },
                    error: {
                        code: 404,
                        message: 'Not Found'
                    }
                });
            });
        });
        describe('should respond with 422 error when sending invalid location', () => {
            it('should respond with 422 when sending string lat/longs', () => {
                const busLocation = utils_1.Utils.location.generateValidLocation();
                const bus = buses.createAndInsertBus(busLocation, busStops_1.BusRouteName.U2);
                const dataToSend = {
                    data: {
                        location: {
                            latitude: 'hello',
                            longitude: 'world'
                        }
                    }
                };
                const expectedResponse = {
                    status: 'failure',
                    error: {
                        code: 422,
                        message: 'Unprocessable Entity'
                    }
                };
                return request(app_1.app)
                    .put(`/buses/${bus.id}'`)
                    .send(dataToSend)
                    .expect(422)
                    .then(res => {
                    chai_1.expect(res.body).to.deep.equal(expectedResponse);
                });
            });
            it('should respond with 422 when sending no data', () => {
                const busLocation = utils_1.Utils.location.generateValidLocation();
                const bus = buses.createAndInsertBus(busLocation, busStops_1.BusRouteName.U2);
                return request(app_1.app)
                    .put(`/buses/${bus.id}`)
                    .expect(422);
            });
        });
    });
});
//# sourceMappingURL=buses.spec.js.map