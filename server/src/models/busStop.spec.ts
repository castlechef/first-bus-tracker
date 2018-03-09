import {expect} from 'chai';
import {BusStop} from './busStop';
import {Utils} from '../utils/utils';
import {BusRouteName} from './busStops';

describe('BusStop', () => {
    describe('hasRoute method', () => {
        it('should accept routes it\'s been given', () => {
            const location = Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: BusRouteName.U1X,
                    position: 4
                },
                {
                    name: BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new BusStop(1, 'Junction Road', location, busRouteData);

            expect(busStop.hasRoute(BusRouteName.U2)).to.be.true;
        });

        it('should not accept routes it should not', ()=>{
            const location = Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: BusRouteName.U1X,
                    position: 4
                },
                {
                    name: BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new BusStop(1, 'Junction Road', location, busRouteData);

            expect(busStop.hasRoute(BusRouteName.U1_ABBEY)).to.be.false;
        });
    });

    describe('getPositionOfRoute method', () => {
        it('should throw error if the bus stop is not on the route', () => {
            const location = Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: BusRouteName.U1X,
                    position: 4
                },
                {
                    name: BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new BusStop(1, 'Junction Road', location, busRouteData);

            expect(() => busStop.getPositionOfRoute(BusRouteName.U1_ABBEY)).to.throw(Error);
        });

        it('should return the position of the stop if it is on the route', () => {
            const location = Utils.location.generateValidLocation();
            const busRouteData = [
                {
                    name: BusRouteName.U1X,
                    position: 4
                },
                {
                    name: BusRouteName.U2,
                    position: 6
                }
            ];
            const busStop = new BusStop(1, 'Junction Road', location, busRouteData);
            expect(busStop.getPositionOfRoute(BusRouteName.U1X)).to.equal(4);
        });
    });


});