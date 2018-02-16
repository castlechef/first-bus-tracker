"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerialPort = require("serialport");
const events_1 = require("events");
const NMEA_1 = require("./NMEA");
class GPSSensor extends events_1.EventEmitter {
    constructor() {
        super();
        this.lines = new GPSLines();
        this.port = new SerialPort('/dev/ttyAMA0', {
            baudRate: 9600
        });
        this.port.on('data', this.handleData.bind(this));
    }
    handleData(data) {
        this.lines.appendData(data);
        if (this.lines.containsLocationData()) {
            const position = this.lines.extractLatestPosition();
            this.emitLocationUpdate(position);
        }
    }
    emitLocationUpdate(position) {
        this.emit('location', position);
    }
}
exports.GPSSensor = GPSSensor;
class GPSLines {
    constructor() {
        this.nmea = new NMEA_1.NMEA();
        this.resetLines();
    }
    resetLines() {
        this.lines = '';
    }
    appendData(rawData) {
        this.lines += GPSLines.formatLine(rawData);
    }
    static formatLine(rawData) {
        const line = GPSLines.ensureString(rawData);
        return GPSLines.removeWhitespace(line);
    }
    static ensureString(line) {
        return (typeof line === "string") ? line : line.toString();
    }
    static removeWhitespace(line) {
        return line.replace(/\s/g, '');
    }
    containsLocationData() {
        return this.matchesGPSFormat();
    }
    matchesGPSFormat() {
        return (GPSLines.GPS_PATTERN.exec(this.lines) !== null);
    }
    extractLatestPosition() {
        const words = GPSLines.GPS_PATTERN.exec(this.lines);
        const rawString = words[0];
        const position = this.nmea.parse(rawString);
        this.resetLines();
        return position;
    }
}
GPSLines.GPS_PATTERN = /$GPGGA,*\*\d{2}/;
exports.GPSLines = GPSLines;
//# sourceMappingURL=GPSSensor.js.map