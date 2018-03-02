import * as request from 'supertest';
import {app} from '../app';
import {expect} from 'chai';
import 'mocha';
import {Utils} from '../utils/utils';

let buses;

describe('buses routes', () => {
    beforeEach(() => {
        buses = app.locals.buses;
        buses.removeAllBuses();
    });

    describe('/buses [POST]', () => {
        it('dodgy data', () => {

            const data = {
                data: {
                    location: {
                        latitude: 'asdf',
                        longitude: false
                    }
                }
            };

            return request(app)
                .post('/buses')
                .send(data)
                .expect(422)
                .then((res) => {
                    expect(res.body.error.code).to.equal(422);
                });
        });

        it('should add new bus', () => {
            const data = {
                data: {
                    location: {
                        latitude: 51.36,
                        longitude: -2.35
                    }
                }
            };

            return request(app)
                .post('/buses')
                .send(data)
                .expect(200)
                .then((res) => {
                    expect(res.body.data.busId).to.equal(0);
                });
        });
    });

    describe('/buses [GET]', () => {
        it('should return list of buses', () => {
            const location0 = Utils.location.generateValidLocation();
            const location1 = Utils.location.generateValidLocation();
            const location2 = Utils.location.generateValidLocation();

            const expectedData = {
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

            const buses = app.locals.buses;
            buses.createAndInsertBus(location0);
            buses.createAndInsertBus(location1);
            buses.createAndInsertBus(location2);

            return request(app).get('/buses')
                .expect(200)
                .then(res => {
                    expect(res.body).to.deep.equal(expectedData);
                });
        });
    });

    describe('/buses/{busId} [PUT]', () => {
        it('should respond with 200 response when location and busId are valid', () => {
            const initialLocation = Utils.location.generateValidLocation();
            const updatedLocation = Utils.location.generateValidLocation();
            const bus = app.locals.buses.createAndInsertBus(initialLocation);

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
                    }
                }
            };

            return request(app)
                .put(`/buses/${bus.id}`)
                .send(dataToSend)
                .expect(200)
                .then(res => {
                    expect(res.body).to.deep.equal(expectedData);
                });
        });

        it('should respond with 404 error when bus with id has been deleted', () => {
            const location = Utils.location.generateValidLocation();
            const bus = buses.createAndInsertBus(location);
            buses.removeBus(bus.id);

            return request(app)
                .put(`/buses/${bus.id}`)
                .send({data: {location: location.toJson()}})
                .expect(404)
                .then(res => {
                    expect(res.body).to.deep.equal({
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
                const busLocation = Utils.location.generateValidLocation();
                const bus = buses.createAndInsertBus(busLocation);

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

                return request(app)
                    .put(`/buses/${bus.id}'`)
                    .send(dataToSend)
                    .expect(422)
                    .then(res => {
                        expect(res.body).to.deep.equal(expectedResponse);
                    });
            });

            it('should respond with 422 when sending no data', () => {
                const busLocation = Utils.location.generateValidLocation();
                const bus = buses .createAndInsertBus(busLocation);

                return request(app)
                    .put(`/buses/${bus.id}`)
                    .expect(422);
            })
        });
    });
});
