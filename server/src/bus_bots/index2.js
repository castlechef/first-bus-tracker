"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busBot_1 = require("./busBot");
const utils_1 = require("../utils/utils");
var randomBetweenNumbers = utils_1.Utils.Numeric.randomBetweenNumbers;
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
];
things.forEach(({ busRoute, nBuses, mph }) => {
    let fracs = [];
    for (let i = 1; i <= nBuses; i++) {
        console.log(i);
        fracs.push(1 / i);
    }
    fracs.forEach(frac => {
        const b = new busBot_1.BusBot(busRoute, mph, interval, frac);
        b.startFollowing().then(() => {
            setTimeout(() => {
                b.runPutRequestOnInterval();
            }, interval);
        });
    });
});
//# sourceMappingURL=index2.js.map