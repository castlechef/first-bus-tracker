import * as SerialPort from 'serialport';
import { EventEmitter } from "events";
import { NMEA } from "./NMEA";
import { GPSPosition } from "./GPSPosition";

export class GPSSensor extends EventEmitter {
    private lines: GPSLines;
    private port: SerialPort;

    constructor() {
        super();
        this.lines = new GPSLines();
        this.port = new SerialPort('/dev/ttyAMA0', {
            baudRate: 9600
        });
        this.port.on('data', this.handleData.bind(this));
    }

    private handleData(data): void {
        this.lines.appendData(data);

        if (this.lines.containsLocationData()) {
            const position = this.lines.extractLatestPosition();
            this.emitLocationUpdate(position);
        }
    }

    private emitLocationUpdate(position): void {
        this.emit('location', position);
    }
}

export class GPSLines {
    private static GPS_PATTERN: RegExp = /$GPGGA,*\*\d{2}/;

    private lines: string;
    private nmea: NMEA;

    constructor() {
        this.nmea = new NMEA();
        this.resetLines();
    }

    private resetLines(): void {
        this.lines = '';
    }

    public appendData(rawData): void {
        this.lines += GPSLines.formatLine(rawData);
    }

    private static formatLine(rawData): string {
        const line = GPSLines.ensureString(rawData);
        return GPSLines.removeWhitespace(line);
    }

    private static ensureString(line): string {
        return (typeof line === "string") ? line : line.toString();
    }

    private static removeWhitespace(line: string): string {
        return line.replace(/\s/g, '');
    }

    public containsLocationData(): boolean {
        return this.matchesGPSFormat();
    }

    private matchesGPSFormat(): boolean {
        return (GPSLines.GPS_PATTERN.exec(this.lines) !== null)
    }

    public extractLatestPosition(): GPSPosition {
        const words = GPSLines.GPS_PATTERN.exec(this.lines);
        const rawString = words[0];
        const position = this.nmea.parse(rawString);
        this.resetLines();

        return position;
    }
}