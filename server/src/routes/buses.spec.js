"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var app_1 = require("../app");
var chai_1 = require("chai");
var location_1 = require("../models/location");
beforeEach(function () {
    app_1.app.locals.buses.removeAllBuses();
});
describe('adding a new bus', function () {
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
describe('should return list of buses', function () {
    it('should return list of buses', function () {
        var location0 = generateValidLocation();
        var location1 = generateValidLocation();
        var location2 = generateValidLocation();
        var expectedData = {
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
        var buses = app_1.app.locals.buses;
        buses.newBus(new location_1.Location(location0));
        buses.newBus(new location_1.Location(location1));
        buses.newBus(new location_1.Location(location2));
        return request(app_1.app).get('/buses')
            .expect(200)
            .then(function (res) {
            chai_1.expect(res.body).to.deep.equal(expectedData);
        });
    });
});
function generateValidLocation() {
    var latitude = (Math.random() * location_1.Location.MAX_LATITUDE) + location_1.Location.MIN_LATITUDE;
    var longitude = (Math.random() * location_1.Location.MAX_LONGITUDE) + location_1.Location.MIN_LONGITUDE;
    return {
        latitude: latitude,
        longitude: longitude
    };
}
