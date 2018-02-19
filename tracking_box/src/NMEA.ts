import {GPSentenceCode} from './helpers/GPSentenceCode';
import {GPSPosition} from './GPSPosition';
import {GPGGA} from './helpers/GPGGA';
import {GPGGL} from './helpers/GPGGL';
import {GPRMC} from './helpers/GPRMC';
import {GPRMZ} from './helpers/GPRMZ';
import {GPVTG} from './helpers/GPVTG';

export class NMEA {
    private sentenceParsers: Map<string, GPSentenceCode>;
    private position: GPSPosition;

    private static startsWithValidSentenceCode(line: string): boolean {
        return /\$GP(GGA|GGL|RMC|RMZ|VTG)/g.test(line);
    }

    private static extractSentenceCode(line: string): string {
        return line.substring(1, 6);
    }

    constructor() {
        this.position = new GPSPosition();
        this.sentenceParsers = new Map([
            ['GPGGA', new GPGGA()],
            ['GPGGL', new GPGGL()],
            ['GPRMC', new GPRMC()],
            ['GPRMZ', new GPRMZ()],
            ['GPVTG', new GPVTG()],
        ]);
    }
    public parse(line: string): GPSPosition {
        if (NMEA.startsWithValidSentenceCode(line)) {
            const sentenceCode = NMEA.extractSentenceCode(line);
            const tokens = line.split(',');
            this.sentenceParsers.get(sentenceCode).parse(tokens, this.position);
            this.position.updateFix();
        }
        return this.position;
    }
}
