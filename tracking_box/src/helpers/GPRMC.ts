import {GPSentenceCode} from './GPSentenceCode';
import {GPSPosition} from '../GPSPosition';

export class GPRMC implements GPSentenceCode {
    parse(tokens: string[], position: GPSPosition): void {
        position.time = parseFloat(tokens[1]);
        position.lat = GPSPosition.latitudeToDecimal(tokens[3], tokens[4]);
        position.lon = GPSPosition.longitudeToDecimal(tokens[5], tokens[6]);
        position.velocity = parseFloat(tokens[7]);
        position.dir = parseFloat(tokens[8]);
    }
}
