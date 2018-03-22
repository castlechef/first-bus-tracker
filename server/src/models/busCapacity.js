"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BusCapacity {
    constructor() {
        this.numberOfDataPoints = 0;
        this.average = -1;
    }
    hasAverage() {
        return this.average !== -1;
    }
    resetAverage() {
        this.numberOfDataPoints = 0;
    }
    addValue(capacity) {
        BusCapacity.ensureValidCapacity(capacity);
        const capacityNum = BusCapacity.CAPACITIES.indexOf(capacity);
        let total = this.average * this.numberOfDataPoints;
        this.numberOfDataPoints++;
        total += capacityNum;
        this.average = total / this.numberOfDataPoints;
    }
    getAverageCapacity() {
        if (!this.hasAverage())
            throw new Error('No capacity available');
        return BusCapacity.CAPACITIES[Math.round(this.average)];
    }
    static ensureValidCapacity(capacity) {
        if (!BusCapacity.isValidCapacity(capacity))
            throw new Error('Invalid capacity');
    }
    static isValidCapacity(capacity) {
        return BusCapacity.CAPACITIES.includes(capacity);
    }
    toJSON() {
        const returnValue = (this.hasAverage()) ? this.getAverageCapacity() : 'UNKNOWN';
        return returnValue;
    }
}
BusCapacity.CAPACITIES = ['EMPTY', 'QUIET', 'BUSY', 'FULL'];
exports.BusCapacity = BusCapacity;
//# sourceMappingURL=busCapacity.js.map