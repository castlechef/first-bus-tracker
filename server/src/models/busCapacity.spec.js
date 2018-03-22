"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busCapacity_1 = require("./busCapacity");
const chai_1 = require("chai");
describe('busCapacity', () => {
    describe('isValidCapacity', () => {
        describe('should accept the 4 valid bus capacities', () => {
            const capacities = ['EMPTY', 'QUIET', 'BUSY', 'FULL'];
            capacities.forEach(capacity => {
                it(`should accept ${capacity}`, () => {
                    chai_1.expect(busCapacity_1.BusCapacity.isValidCapacity(capacity)).to.be.true;
                });
            });
        });
        describe('should reject some invalid stuff', () => {
            const capacities = [undefined, 2, null, NaN, '23', 'hello world', 'empty', 'Empty', ['E', 'M', 'P', 'T', 'Y']];
            capacities.forEach(capacity => {
                it(`should accept ${capacity}`, () => {
                    chai_1.expect(busCapacity_1.BusCapacity.isValidCapacity(capacity)).to.be.false;
                });
            });
        });
    });
    describe('addValue', () => {
        const busCapacity = new busCapacity_1.BusCapacity();
        busCapacity.addValue('EMPTY');
    });
    describe('resetAverage', () => {
        it('should keep previous average until new value added', () => {
            const busCapacity = new busCapacity_1.BusCapacity();
            const value = 'EMPTY';
            busCapacity.addValue(value);
            busCapacity.resetAverage();
            chai_1.expect(busCapacity.getAverageCapacity()).to.equal(value);
        });
        it('should ignore old values after resetting and adding a new value', () => {
            const busCapacity = new busCapacity_1.BusCapacity();
            busCapacity.addValue('EMPTY');
            chai_1.expect(busCapacity.getAverageCapacity()).to.equal('EMPTY');
            busCapacity.resetAverage();
            busCapacity.addValue('FULL');
            chai_1.expect(busCapacity.getAverageCapacity()).to.equal('FULL');
        });
    });
    describe('getAverageCapacity', () => {
        it('should round capacity to nearest value', () => {
            const busCapacity = new busCapacity_1.BusCapacity();
            busCapacity.addValue('QUIET');
            busCapacity.addValue('QUIET');
            busCapacity.addValue('BUSY');
            chai_1.expect(busCapacity.getAverageCapacity()).to.equal('QUIET');
        });
    });
});
//# sourceMappingURL=busCapacity.spec.js.map