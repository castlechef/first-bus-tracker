"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lcd = require("lcd");
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
    }, 1000);
});
const child_process_1 = require("child_process");
const NMEA_1 = require("./NMEA");
const cat = child_process_1.spawn('cat', ['<', '/dev/ttyAMA0']);
let lines;
cat.stdout.on('data', data => {
    let str = data.toString();
    lines += str;
    if (lines.indexOf('GPGGA') !== lines.lastIndexOf('GPGGA')) {
        lines = lines.split('GPGGA');
        if (lines.length < 3)
            return;
        lines.splice(1, 1);
        let line = lines.splice(1, 1);
        lines = lines.join('GPGGA');
        let nmea = new NMEA_1.NMEA();
        const pos = nmea.parse(line);
        console.log('position', pos);
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
process.on('exit', exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
//# sourceMappingURL=app.js.map