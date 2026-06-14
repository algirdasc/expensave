import { APP_CONFIG } from '../app.initializer';
import { ShortNumberPipe } from './shortnumber.pipe';

describe('ShortNumberPipe', () => {
    let pipe: ShortNumberPipe;

    beforeEach(() => {
        APP_CONFIG.locale = 'en-US';
        pipe = new ShortNumberPipe();
    });

    it('formats finite numbers with two decimal places by default', (): void => {
        expect(pipe.transform(12.3)).toBe('12.30');
        expect(pipe.transform(-12.345)).toBe('-12.35');
    });

    it('parses string input before formatting', (): void => {
        expect(pipe.transform('1234')).toBe('1.23K');
    });

    it('returns an empty string for non-numeric values', (): void => {
        expect(pipe.transform('not a number')).toBe('');
        expect(pipe.transform(null as unknown as number)).toBe('');
    });

    it('uses compact suffixes for large values', (): void => {
        expect(pipe.transform(1234)).toBe('1.23K');
        expect(pipe.transform(1_250_000)).toBe('1.25M');
        expect(pipe.transform(-2_500_000_000)).toBe('-2.50B');
    });

    it('honors an explicit number format', (): void => {
        expect(pipe.transform(1234, '.0-0')).toBe('1K');
    });
});
