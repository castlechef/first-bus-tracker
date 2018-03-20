import * as request from 'supertest';
import {app} from '../app';
import {expect} from 'chai';
import 'mocha';
import {Utils} from '../utils/utils';
import {BusRouteName} from '../models/busStops';
import {Location} from '../models/location';

let buses;

describe('buses routes', () => {
    beforeEach(() => {
        buses = app.locals.buses;
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
                    routeName: BusRouteName.U1X
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

        it('dodgy route name', () => {
            const data = {
                data: {
                    location: Utils.location.generateValidLocation().toJSON(),
                    routeName: "Fail please"
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
                    location: Utils.location.generateValidLocation().toJSON(),
                    routeName: BusRouteName.U1X
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
                        'location': location0.toJSON(),
                        'routeName': BusRouteName.U1_OLDFIELD
                    },
                    {
                        'busId': 1,
                        'location': location1.toJSON(),
                        'routeName': BusRouteName.U2
                    },
                    {
                        'busId': 2,
                        'location': location2.toJSON(),
                        'routeName': BusRouteName.U1X
                    }
                ]
            };

            const buses = app.locals.buses;
            buses.createAndInsertBus(location0, BusRouteName.U1_OLDFIELD);
            buses.createAndInsertBus(location1, BusRouteName.U2);
            buses.createAndInsertBus(location2, BusRouteName.U1X);

            return request(app).get('/buses')
                .expect(200)
                .then(res => {
                    expect(res.body).to.deep.equal(expectedData);
                });
        });
    });

    describe('/buses/{busId} [GET]', () => {
        it('should return empty arrival times when bus route is not established', () => {
            const location = new Location({latitude: 51.362944, longitude: -2.339107});
            const routeName = BusRouteName.U2;
            const bus = app.locals.buses.createAndInsertBus(location, routeName);

            return request(app)
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
                    expect(data).to.deep.equal(expectedData);
                });
        });

        it('should return 10 next arrival times and 2 latest departure times once bus is established', () => {
            const location = new Location({latitude: 51.362944, longitude: -2.339107});
            const location2 = new Location({latitude: 51.362587, longitude: -2.342343});
            const routeName = BusRouteName.U2;
            const bus = app.locals.buses.createAndInsertBus(location, routeName);
            bus.updateLocation(location2);

            return request(app)
                .get(`/buses/${bus.id}`)
                .expect(200)
                .then(res => {
                    const data = res.body.data;
                    expect(data.arrivalTimes.length).to.equal(10);
                    expect(data.departureTimes.length).to.equal(2);
                });
        });

        it('should return 10 next arrival times and most recent 2 departure times after more than 2 departures', () => {
            const location = new Location({latitude: 51.362944, longitude: -2.339107});
            const location1 = new Location({latitude: 51.362587, longitude: -2.342343});
            const location2 = new Location({latitude: 51.362089, longitude: -2.346247});
            const routeName = BusRouteName.U2;
            const bus = app.locals.buses.createAndInsertBus(location, routeName);
            bus.updateLocation(location1);
            bus.updateLocation(location2);

            return request(app)
                .get(`/buses/${bus.id}`)
                .expect(200)
                .then(res => {
                    const data = res.body.data;
                    expect(data.arrivalTimes.length).to.equal(10);
                    expect(data.departureTimes.length).to.equal(2);
                });
        });
    });

    describe('/buses/{busId} [PUT]', () => {
        it('should respond with 200 response when location and busId are valid', () => {
            const initialLocation = Utils.location.generateValidLocation();
            const updatedLocation = Utils.location.generateValidLocation();
            const bus = app.locals.buses.createAndInsertBus(initialLocation, BusRouteName.U2);

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
                    routeName: BusRouteName.U2
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
            const bus = buses.createAndInsertBus(location, BusRouteName.U2);
            buses.removeBus(bus.id);

            return request(app)
                .put(`/buses/${bus.id}`)
                .send({data: {location: location.toJSON()}})
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
                const bus = buses.createAndInsertBus(busLocation, BusRouteName.U2);

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
                const bus = buses .createAndInsertBus(busLocation, BusRouteName.U2);

                return request(app)
                    .put(`/buses/${bus.id}`)
                    .expect(422);
            })
        });
    });
});
