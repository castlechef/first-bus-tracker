import * as Lcd from 'lcd';
import {GPSSensor} from './GPSSensor';
<<<<<<< HEAD
import {TrackingBox} from './TrackingBox';
import {DisplayOptions} from './Display';

/*const gpsSensor = new GPSSensor();



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
*/


/*
rs - 25
e  - 24
d4 - 23
d5 - 22
d6 - 27
d7 - 17
*/

/*
b1 - 5
b2 - 6
 */
const displayOptions: DisplayOptions = {
    rs: 25,
    e: 24,
    data: [23, 22, 27, 17],
    cols: 16,
    rows: 2
};

const trackingBox: TrackingBox = new TrackingBox(displayOptions, 5, 6);
const gpsSensor: GPSSensor = new GPSSensor();
gpsSensor.on('location', (position) => {});
trackingBox.start();
