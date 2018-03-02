"use strict";
exports.__esModule = true;
var request = require("supertest");
var app_1 = require("../app");
var chai_1 = require("chai");
require("mocha");
var utils_1 = require("../utils/utils");
var buses;
describe('buses routes', function () {
    beforeEach(function () {
        buses = app_1.app.locals.buses;
        buses.removeAllBuses();
    });
    describe('/buses [POST]', function () {
        it('dodgy data', function () {
            var data = {
                data: {
                    location: {
                        latitude: 'asdf',
                        longitude: false
                    }
                }
            };
            return request(app_1.app)
                .post('/buses')
                .send(data)
                .expect(422)
                .then(function (res) {
                chai_1.expect(res.body.error.code).to.equal(422);
            });
        });
        it('should add new bus', function () {
            var data = {
                data: {
                    location: {
                        latitude: 51.36,
                        longitude: -2.35
                    }
                }
            };
            return request(app_1.app)
                .post('/buses')
                .send(data)
                .expect(200)
                .then(function (res) {
                chai_1.expect(res.body.data.busId).to.equal(0);
            });
        });
    });
    describe('/buses [GET]', function () {
        it('should return list of buses', function () {
            var location0 = utils_1.Utils.location.generateValidLocation();
            var location1 = utils_1.Utils.location.generateValidLocation();
            var location2 = utils_1.Utils.location.generateValidLocation();
            var expectedData = {
                'status': 'success',
                'data': [
                    {
                        'busId': 0,
                        'location': location0.toJson()
                    },
                    {
                        'busId': 1,
                        'location': location1.toJson()
                    },
                    {
                        'busId': 2,
                        'location': location2.toJson()
                    }
                ]
            };
            var buses = app_1.app.locals.buses;
            buses.createAndInsertBus(location0);
            buses.createAndInsertBus(location1);
            buses.createAndInsertBus(location2);
            return request(app_1.app).get('/buses')
                .expect(200)
                .then(function (res) {
                chai_1.expect(res.body).to.deep.equal(expectedData);
            });
        });
    });
    describe('/buses/{busId} [PUT]', function () {
        it('should respond with 200 response when location and busId are valid', function () {
            var initialLocation = utils_1.Utils.location.generateValidLocation();
            var updatedLocation = utils_1.Utils.location.generateValidLocation();
            var bus = app_1.app.locals.buses.createAndInsertBus(initialLocation);
            var dataToSend = {
                data: {
                    location: {
                        latitude: updatedLocation.latitude,
                        longitude: updatedLocation.longitude
                    }
                }
            };
            var expectedData = {
                status: 'success',
                data: {
                    busId: bus.id,
                    location: {
                        latitude: updatedLocation.latitude,
                        longitude: updatedLocation.longitude
                    }
                }
            };
            return request(app_1.app)
                .put("/buses/" + bus.id)
                .send(dataToSend)
                .expect(200)
                .then(function (res) {
                chai_1.expect(res.body).to.deep.equal(expectedData);
            });
        });
        it('should respond with 404 error when bus with id has been deleted', function () {
            var location = utils_1.Utils.location.generateValidLocation();
            var bus = buses.createAndInsertBus(location);
            buses.removeBus(bus.id);
            return request(app_1.app)
                .put("/buses/" + bus.id)
                .send({ data: { location: location.toJson() } })
                .expect(404)
                .then(function (res) {
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
        describe('should respond with 422 error when sending invalid location', function () {
            it('should respond with 422 when sending string lat/longs', function () {
                var busLocation = utils_1.Utils.location.generateValidLocation();
                var bus = buses.createAndInsertBus(busLocation);
                var dataToSend = {
                    data: {
                        location: {
                            latitude: 'hello',
                            longitude: 'world'
                        }
                    }
                };
                var expectedResponse = {
                    status: 'failure',
                    error: {
                        code: 422,
                        message: 'Unprocessable Entity'
                    }
                };
                return request(app_1.app)
                    .put("/buses/" + bus.id + "'")
                    .send(dataToSend)
                    .expect(422)
                    .then(function (res) {
                    chai_1.expect(res.body).to.deep.equal(expectedResponse);
                });
            });
            it('should respond with 422 when sending no data', function () {
                var busLocation = utils_1.Utils.location.generateValidLocation();
                var bus = buses.createAndInsertBus(busLocation);
                return request(app_1.app)
                    .put("/buses/" + bus.id)
                    .expect(422);
            });
        });
    });
});
