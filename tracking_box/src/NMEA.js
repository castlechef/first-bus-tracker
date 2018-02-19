"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GPSPosition_1 = require("./GPSPosition");
const GPGGA_1 = require("./helpers/GPGGA");
const GPGGL_1 = require("./helpers/GPGGL");
const GPRMC_1 = require("./helpers/GPRMC");
const GPRMZ_1 = require("./helpers/GPRMZ");
const GPVTG_1 = require("./helpers/GPVTG");
class NMEA {
    static startsWithValidSentenceCode(line) {
        return /\$GP(GGA|GGL|RMC|RMZ|VTG)/g.test(line);
    }
    static extractSentenceCode(line) {
        return line.substring(1, 6);
    }
    constructor() {
        this.position = new GPSPosition_1.GPSPosition();
        this.sentenceParsers = new Map([
            ['GPGGA', new GPGGA_1.GPGGA()],
            ['GPGGL', new GPGGL_1.GPGGL()],
            ['GPRMC', new GPRMC_1.GPRMC()],
            ['GPRMZ', new GPRMZ_1.GPRMZ()],
            ['GPVTG', new GPVTG_1.GPVTG()],
        ]);
    }
    parse(line) {
        if (NMEA.startsWithValidSentenceCode(line)) {
            const sentenceCode = NMEA.extractSentenceCode(line);
            const tokens = line.split(',');
            this.sentenceParsers.get(sentenceCode).parse(tokens, this.position);
            this.position.updateFix();
        }
        return this.position;
    }
}
exports.NMEA = NMEA;
//# sourceMappingURL=NMEA.js.map