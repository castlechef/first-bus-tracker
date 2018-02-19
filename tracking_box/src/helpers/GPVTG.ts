import {GPSentenceCode} from './GPSentenceCode';
import {GPSPosition} from '../GPSPosition';

export class GPVTG implements GPSentenceCode {
    parse(tokens: string[], position: GPSPosition): void {
        position.dir = parseFloat(tokens[3]);
    }
}
