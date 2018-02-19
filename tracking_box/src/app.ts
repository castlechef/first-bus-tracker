import {GPSSensor} from './GPSSensor';

const gpsSensor = new GPSSensor();

gpsSensor.on('location', location => {
    console.log(location);
});
