import * as Lcd from 'lcd';
import {GPSSensor} from './GPSSensor';
import {GPSPosition} from './GPSPosition';

//const gpsSensor = new GPSSensor();


const LCD_OPTIONS = {
    rs: 25,
    e: 24,
    data: [23, 22, 27, 17],
    cols: 16,
    rows: 2
};
let i = 0;
const lcd = new Lcd(LCD_OPTIONS);
lcd.on('ready', () => {
    lcd.setCursor(0, 0);
    lcd.print('hello world');
    setInterval(() => {
        lcd.setCursor(12, 0);
        lcd.print(`${++i}`);
    }, 1000)
});

import {spawn} from 'child_process';
import {NMEA} from './NMEA';

const cat = spawn('cat', ['<', '/dev/ttyAMA0']);

let lines = [];
let incomplete = '';
cat.stdout.on('data', data => {
    let str = data.toString().replace('\n', '').replace('\r', '');
    incomplete += str;
    if (incomplete.substring(1).indexOf('$') !== -1) {
        let parts = incomplete.split('$');
        parts.splice(0, 1);
        let thingIWant = '$' + parts.splice(0, 1);
        incomplete = '$' + parts.join('$');
        if (thingIWant.startsWith('$GPGGA')) {
            console.log(new NMEA().parse(thingIWant));
        }
    }
});

/*gpsSensor.on('location', (location: GPSPosition) => {
    console.log(location);
    lcd.setCursor(0, 1);
    lcd.print('gomme some dd');
});*/


function exitHandler(options, err) {
    if (lcd) {
        lcd.close();
    }
    process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));