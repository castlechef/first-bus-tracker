"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GPSPosition_1 = require("../GPSPosition");
class GPGGA {
    parse(tokens, position) {
        position.time = parseFloat(tokens[1]);
        position.lat = GPSPosition_1.GPSPosition.latitudeToDecimal(tokens[2], tokens[3]);
        position.lon = GPSPosition_1.GPSPosition.longitudeToDecimal(tokens[4], tokens[5]);
        position.quality = parseInt(tokens[6]);
        position.altitude = parseFloat(tokens[9]);
    }
}
exports.GPGGA = GPGGA;
//# sourceMappingURL=GPGGA.js.map