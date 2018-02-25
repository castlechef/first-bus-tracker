"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var app_1 = require("./app");
var chai_1 = require("chai");
require("mocha");
describe('testing the api root', function () {
    it('should have a nice test', function () {
        chai_1.expect(2).to.equal(2);
    });
    it('responds with hello world object', function () {
        return request(app_1.app)
            .get('/hey')
            .then(function (res) {
            chai_1.expect(res.body).to.deep.equal({ hello: 'world' });
        });
    });
});
describe('post route for locations', function () {
    it('should view location of response', function () {
        var data = {
            data: {
                location: {
                    latitude: 53.003444,
                    longitude: -2.273507
                }
            }
        };
        return request(app_1.app)
            .post('/location')
            .send(data)
            .then(function (res) {
            chai_1.expect(res.body.data.busId).to.equal(1);
        });
    });
});
describe('add function for alice :)', function () {
    it('should add positive numbers', function () {
        chai_1.expect(add(2, 3)).to.equal(5);
    });
});
function add(n1, n2) {
    return n1 + n2;
}
