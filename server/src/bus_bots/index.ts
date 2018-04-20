import {BusBot} from './busBot';

function getOptionsFromArray(optionsArr: string[]): any {
    return optionsArr
        .filter(optionStr => /^--\S+=\S+$/g.test(optionStr))
        .map(optionStr => optionStr.replace('--', '').split('='))
        .reduce<any>((o, arr) => ({...o,[dashedToCamelCase(arr[0])]: dashedToSpaced(arr[1])}),{});
}

function dashedToCamelCase(dashed: string): string {
    if (!dashed.includes('-')) return dashed;
    let parts = dashed.split('-').filter(s => s.length > 0);
    return [parts.shift(), ...parts.map(s => s.replace(/^[a-z]/g, c => c.toUpperCase()))].join('');
}

function dashedToSpaced(dashed: string): string {
    return dashed.split('-').join(' ');
}

const {busRoute, interval = 1000, mph = '25', nBuses = 1} = getOptionsFromArray(process.argv.slice(2));

let fracs = [];
for (let i = 1; i <= parseInt(nBuses); i++) {
    console.log(i);
    fracs.push(1 / i);
}

fracs.forEach(frac => {
    const b = new BusBot(busRoute, parseInt(mph), interval, frac);
    b.startFollowing().then(() => {
        setTimeout(() => {
            b.runPutRequestOnInterval();
        }, interval);
    });
});

