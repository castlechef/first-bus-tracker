"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busBot_1 = require("./busBot");
function getOptionsFromArray(optionsArr) {
    return optionsArr
        .filter(optionStr => /^--\S+=\S+$/g.test(optionStr))
        .map(optionStr => optionStr.replace('--', '').split('='))
        .reduce((o, arr) => (Object.assign({}, o, { [dashedToCamelCase(arr[0])]: dashedToSpaced(arr[1]) })), {});
}
function dashedToCamelCase(dashed) {
    if (!dashed.includes('-'))
        return dashed;
    let parts = dashed.split('-').filter(s => s.length > 0);
    return [parts.shift(), ...parts.map(s => s.replace(/^[a-z]/g, c => c.toUpperCase()))].join('');
}
function dashedToSpaced(dashed) {
    return dashed.split('-').join(' ');
}
const { busRoute, interval = 1000, mph = '25', nBuses = 1 } = getOptionsFromArray(process.argv.slice(2));
let fracs = [];
for (let i = 1; i <= parseInt(nBuses); i++) {
    console.log(i);
    fracs.push(1 / i);
}
fracs.forEach(frac => {
    const b = new busBot_1.BusBot(busRoute, parseInt(mph), interval, frac);
    b.startFollowing().then(() => {
        setTimeout(() => {
            b.runPutRequestOnInterval();
        }, interval);
    });
});
//# sourceMappingURL=index.js.map