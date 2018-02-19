import {GPSentenceCode} from './GPSentenceCode';
import {GPSPosition} from '../GPSPosition';

export class GPGGL implements GPSentenceCode {
    parse(tokens: string[], position: GPSPosition): void {
        position.lat = GPSPosition.latitudeToDecimal(tokens[1], tokens[2]);
        position.lon = GPSPosition.longitudeToDecimal(tokens[3], tokens[4]);
        position.time = parseFloat(tokens[5]);
    }
}
