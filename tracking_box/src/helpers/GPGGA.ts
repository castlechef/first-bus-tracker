import {GPSentenceCode} from './GPSentenceCode';
import {GPSPosition} from '../GPSPosition';

export class GPGGA implements GPSentenceCode {
    parse(tokens: string[], position: GPSPosition): void {
        position.time = parseFloat(tokens[1]);
        position.lat = GPSPosition.latitudeToDecimal(tokens[2], tokens[3]);
        position.lon = GPSPosition.longitudeToDecimal(tokens[4], tokens[5]);
        position.quality = parseInt(tokens[6], 10);
        position.altitude = parseFloat(tokens[9]);
    }
}
