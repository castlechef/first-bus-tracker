"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const NMEA_1 = require("./NMEA");
const child_process_1 = require("child_process");
/*
export class GPSSensor extends EventEmitter {
    private lines: GPSLines;
    private port: SerialPort;

    constructor() {
        super();
        this.lines = new GPSLines();
        /*this.port = new SerialPort('/dev/ttyAMA0', {
            baudRate: 9600
        });*/ /*
this.port = spawn('cat', ['<', '/dev/ttyAMA0']).stdout;
this.port.on('data', this.handleData.bind(this));
}

private handleData(data: any): void {
this.lines.appendData(data);
console.log(this.lines.lines);
if (this.lines.containsLocationData()) {
    const position = this.lines.extractLatestPosition();
    this.emitLocationUpdate(position);
}
}

private emitLocationUpdate(position: GPSPosition): void {
this.emit('location', position);
}
}

export class GPSLines {
private static GPS_PATTERN: RegExp = /$GPGGA,*\*\d{2}/;

private lines: string;
private nmea: NMEA;

private static formatLine(rawData: any): string {
const line = GPSLines.ensureString(rawData);
return GPSLines.removeWhitespace(line);
}

private static ensureString(line: any): string {
return (typeof line === 'string') ? line : line.toString();
}

private static removeWhitespace(line: string): string {
return line.replace(/\s/g, '');
}

constructor() {
this.nmea = new NMEA();
this.resetLines();
}

public appendData(rawData: any): void {
this.lines += GPSLines.formatLine(rawData).replace('\n', '').replace('\r', '');
}

public containsLocationData(): boolean {
return this.matchesGPSFormat();
}

public extractLatestPosition(): GPSPosition {
const words = GPSLines.GPS_PATTERN.exec(this.lines);
const rawString = words[0];
const position = this.nmea.parse(rawString);
this.resetLines();

return position;
}

private matchesGPSFormat(): boolean {
return (GPSLines.GPS_PATTERN.exec(this.lines) !== null);
}

private resetLines(): void {
this.lines = '';
}
}*/
class GPSSensor extends events_1.EventEmitter {
    constructor() {
        super();
        const cat = child_process_1.spawn('cat', ['<', '/dev/ttyAMA0']);
        let incomplete = '';
        cat.stdout.on('data', data => {
            let str = data.toString().replace('\n', '').replace('\r', '');
            incomplete += str;
            if (incomplete.substring(1).indexOf('$') !== -1) {
                let parts = incomplete.split('$');
                parts.splice(0, 1);
                let thingIWant = '$' + parts.splice(0, 1);
                incomplete = '$' + parts.join('$');
                if (thingIWant.startsWith('$GPGGA')) {
                    let position = new NMEA_1.NMEA().parse(thingIWant);
                    this.emit('position', position);
                }
            }
        });
    }
}
exports.GPSSensor = GPSSensor;
//# sourceMappingURL=GPSSensor.js.map