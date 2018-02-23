import * as request from 'supertest';
import {app} from './app';
import {expect} from 'chai';

describe('testing the api root', () => {

    it('should have a nice test', () => {
        expect(2).to.equal(2);
    });

    it('responds with hello world object', () => {

        return request(app)
            .get('/hey')
            .then((res) => {
                expect(res.body).to.deep.equal({hello: 'world'});
            });
    });

});

describe('post route for locations', () => {
    it('should view location of response', () => {

        const data = {
            data: {
                location: {
                    latitude: 53.003444,
                    longitude: -2.273507
                }
            }
        };

        return request(app)
            .post('/location')
            .send(data)
            .then(res => {
                expect(res.body.data.busId).to.equal(1);
            });
    });
});

describe('add function for alice :)', () => {
    it('should add positive numbers', () => {
        expect(add(2, 3)).to.equal(6);
    });
});

function add(n1: number, n2: number): number {
    return n1 + n2;
}
