import {GPSentenceCode} from './GPSentenceCode';
import {GPSPosition} from '../GPSPosition';

export class GPRMZ implements GPSentenceCode {
    parse(tokens: string[], position: GPSPosition): void {
        position.altitude = parseFloat(tokens[1]);
    }
}
