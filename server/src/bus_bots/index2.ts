import {BusBot} from './busBot';
import {Utils} from '../utils/utils';
import randomBetweenNumbers = Utils.Numeric.randomBetweenNumbers;
import {BusRouteName} from '../models/busStops';

const interval = 1000;
const things = [
    {
        busRoute: 'U1',
        nBuses: 5,
        mph: randomBetweenNumbers(25, 30)
    },
    {
        busRoute: 'U1X',
        nBuses: 2,
        mph: randomBetweenNumbers(25, 30)
    },
    {
        busRoute: 'U2',
        nBuses: 3,
        mph: randomBetweenNumbers(35, 40)
    }
] as {busRoute: BusRouteName, nBuses: number, mph: number}[];

things.forEach(({busRoute, nBuses, mph}) => {
    let fracs = [];
    for (let i = 1; i <= nBuses; i++) {
        console.log(i);
        fracs.push(1 / i);
    }

    fracs.forEach(frac => {
        const b = new BusBot(busRoute, mph, interval, frac);
        b.startFollowing().then(() => {
            setTimeout(() => {
                b.runPutRequestOnInterval();
            }, interval);
        });
    });
});
