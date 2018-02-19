"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GPSPosition {
    static latitudeToDecimal(lat, NS) {
        let med = (parseFloat(lat.substring(2)) / 60.0);
        med += parseFloat(lat.substring(0, 2));
        if (NS.startsWith('S')) {
            med = -med;
        }
        return med;
    }
    static longitudeToDecimal(lon, WE) {
        let med = parseFloat(lon.substring(3)) / 60.0;
        med += parseFloat(lon.substring(0, 3));
        if (WE.startsWith('W')) {
            med = -med;
        }
        return med;
    }
    constructor() {
        this.time = 0.0;
        this.lat = 0.0;
        this.lon = 0.0;
        this.fixed = false;
        this.quality = 0;
        this.dir = 0.0;
        this.altitude = 0.0;
        this.velocity = 0.0;
    }
    updateFix() {
        this.fixed = this.quality > 0;
    }
    toString() {
        return `POSITION lat: ${this.lat}, lon: ${this.lon}, time: ${this.time}, ` +
            `Q: ${this.quality}, dir: ${this.dir}, alt: ${this.altitude}, vel: ${this.velocity}`;
    }
}
exports.GPSPosition = GPSPosition;
//# sourceMappingURL=GPSPosition.js.map