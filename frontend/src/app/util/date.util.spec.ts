import { DateUtil } from './date.util';

describe('DateUtil', () => {
    it('returns a copy set to the end of the day', (): void => {
        const source = new Date('2026-02-03T04:05:06.007');
        const result = DateUtil.endOfTheDay(source);

        expect(result).not.toBe(source);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(1);
        expect(result.getDate()).toBe(3);
        expect(result.getHours()).toBe(23);
        expect(result.getMinutes()).toBe(59);
        expect(result.getSeconds()).toBe(59);
        expect(source.getHours()).toBe(4);
    });

    it('copies time from one date to another without mutating either source date', (): void => {
        const date = new Date('2026-02-03T00:00:00.000');
        const time = new Date('2024-01-01T12:34:56.789');
        const result = DateUtil.setTime(date, time);

        expect(result).not.toBe(date);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(1);
        expect(result.getDate()).toBe(3);
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(34);
        expect(result.getSeconds()).toBe(56);
        expect(result.getMilliseconds()).toBe(789);
        expect(date.getHours()).toBe(0);
    });

    it('detects valid and invalid dates', (): void => {
        expect(DateUtil.valid(new Date('2026-01-01T00:00:00'))).toBeTrue();
        expect(DateUtil.valid(new Date('not a date'))).toBeFalse();
    });

    it('returns the first day of the week with time reset', (): void => {
        const result = DateUtil.firstDayOfWeek(new Date('2026-01-08T12:34:56'), 1);

        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(0);
        expect(result.getDate()).toBe(5);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });
});
