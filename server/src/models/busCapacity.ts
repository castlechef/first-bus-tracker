import {JSONable} from './response';

export type Capacity = string;

export class BusCapacity implements JSONable {
    private static readonly CAPACITIES: Capacity[] = ['EMPTY', 'QUIET', 'BUSY', 'FULL'];

    private numberOfDataPoints: number;
    private average: number;

    constructor() {
        this.numberOfDataPoints = 0;
        this.average = -1;
    }

    public hasAverage(): boolean {
        return this.average !== -1;
    }

    public resetAverage(): void {
        this.numberOfDataPoints = 0;
    }

    public addValue(capacity: Capacity): void {
        BusCapacity.ensureValidCapacity(capacity);
        const capacityNum = BusCapacity.CAPACITIES.indexOf(capacity);
        let total = this.average * this.numberOfDataPoints;
        this.numberOfDataPoints++;
        total += capacityNum;
        this.average = total / this.numberOfDataPoints;
    }

    public getAverageCapacity(): Capacity {
        if (!this.hasAverage()) throw new Error('No capacity available');
        return BusCapacity.CAPACITIES[Math.round(this.average)];
    }

    private static ensureValidCapacity(capacity: Capacity): void {
        if (!BusCapacity.isValidCapacity(capacity)) throw new Error('Invalid capacity');
    }

    public static isValidCapacity(capacity: Capacity): boolean {
        return BusCapacity.CAPACITIES.includes(capacity);
    }

    public toJSON(): object {
        const returnValue = (this.hasAverage()) ? this.getAverageCapacity() : 'UNKNOWN';
        return returnValue as any as object;
    }
}