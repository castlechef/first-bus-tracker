import * as request from 'supertest';
import {app} from '../app';
import {expect} from 'chai';
import {} from 'mocha';
import {ILocation, Location} from '../models/location';

beforeEach(() => {
    app.locals.buses.removeAllBuses();
});

describe('adding a new bus', () => {
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

describe('should return list of buses', () => {
    it('should return list of buses', () => {
        const location0 = generateValidLocation();
        const location1 = generateValidLocation();
        const location2 = generateValidLocation();

        const expectedData = {
            'status': 'success',
            'data': [
                {
                    'busId': 0,
                    'location': location0
                },
                {
                    'busId': 1,
                    'location': location1
                },
                {
                    'busId': 2,
                    'location': location2
                }
            ]
        };

        const buses = app.locals.buses;
        buses.newBus(new Location(location0));
        buses.newBus(new Location(location1));
        buses.newBus(new Location(location2));

        return request(app).get('/buses')
            .expect(200)
            .then(res => {
                expect(res.body).to.deep.equal(expectedData);
            });
    });
});

function generateValidLocation(): ILocation {
    const latitude = (Math.random() * Location.MAX_LATITUDE) + Location.MIN_LATITUDE;
    const longitude = (Math.random() * Location.MAX_LONGITUDE) + Location.MIN_LONGITUDE;
    return {
        latitude,
        longitude
    };
}
