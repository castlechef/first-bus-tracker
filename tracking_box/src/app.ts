import * as Lcd from 'lcd';
import {GPSSensor} from './GPSSensor';
import {GPSPosition} from './GPSPosition';

const gpsSensor = new GPSSensor();

gpsSensor.on('location', (location: GPSPosition) => {
    console.log(location);
});

const LCD_OPTIONS = {
    rs: 25,
    e: 24,
    data: [23, 22, 27, 17],
    cols: 16,
    rows: 2
};

const lcd = new Lcd(LCD_OPTIONS);
lcd.on('ready', () => {
    lcd.setCursor(0, 0);
    lcd.print('hello world');
});

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