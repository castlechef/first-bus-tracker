import {BusCapacity, Capacity} from './busCapacity';
import {expect} from 'chai';

describe('busCapacity', () => {

    describe('isValidCapacity', () => {

        describe('should accept the 4 valid bus capacities', () => {
            const capacities = ['EMPTY', 'QUIET', 'BUSY', 'FULL'];
            capacities.forEach(capacity => {
                it(`should accept ${capacity}`, () => {
                    expect(BusCapacity.isValidCapacity(capacity)).to.be.true;
                })
            });
        });

        describe('should reject some invalid stuff', () => {
            const capacities = [undefined, 2, null, NaN, '23', 'hello world', 'empty', 'Empty', ['E', 'M', 'P', 'T', 'Y']] as Capacity[];
            capacities.forEach(capacity => {
                it(`should accept ${capacity}`, () => {
                    expect(BusCapacity.isValidCapacity(capacity)).to.be.false;
                })
            });
        });
    });

    describe('addValue', () => {
        const busCapacity = new BusCapacity();
        busCapacity.addValue('EMPTY');
    });

    describe('resetAverage', () => {
        it('should keep previous average until new value added', () => {
            const busCapacity = new BusCapacity();
            const value = 'EMPTY';
            busCapacity.addValue(value);
            busCapacity.resetAverage();
            expect(busCapacity.getAverageCapacity()).to.equal(value);
        });

        it('should ignore old values after resetting and adding a new value', () => {
            const busCapacity = new BusCapacity();
            busCapacity.addValue('EMPTY');
            expect(busCapacity.getAverageCapacity()).to.equal('EMPTY');
            busCapacity.resetAverage();
            busCapacity.addValue('FULL');
            expect(busCapacity.getAverageCapacity()).to.equal('FULL');
        });
    });

    describe('getAverageCapacity', () => {
        it('should round capacity to nearest value', () => {
            const busCapacity = new BusCapacity();
            busCapacity.addValue('QUIET');
            busCapacity.addValue('QUIET');
            busCapacity.addValue('BUSY');
            expect(busCapacity.getAverageCapacity()).to.equal('QUIET');
        });
    });
});
