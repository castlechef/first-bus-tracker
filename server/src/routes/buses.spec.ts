import * as request from 'supertest';
import {app} from '../app';
import {expect} from 'chai';
import 'mocha';
import {Utils} from '../utils/utils';

describe('buses routes', () => {
    beforeEach(() => {
        app.locals.buses.removeAllBuses();
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

    });
});
