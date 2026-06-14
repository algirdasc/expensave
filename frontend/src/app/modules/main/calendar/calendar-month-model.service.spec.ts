import { TestBed } from '@angular/core/testing';
import { NbDateService } from '@nebular/theme';
import { CalendarMonthModelService } from './calendar-month-model.service';

describe('CalendarMonthModelService', () => {
    let service: CalendarMonthModelService<Date>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CalendarMonthModelService,
                {
                    provide: NbDateService,
                    useValue: nativeDateService() as NbDateService<Date>,
                },
            ],
        });

        service = TestBed.inject(CalendarMonthModelService<Date>);
    });

    it('creates a six-week calendar grid with previous and next bounding month dates', (): void => {
        const grid = service.createDaysGrid(new Date('2026-05-15T00:00:00'), true, 1);

        expect(grid.length).toBe(6);
        expect(grid.every(week => week.length === 7)).toBeTrue();
        expect(dayNumbers(grid[0])).toEqual([27, 28, 29, 30, 1, 2, 3]);
        expect(monthNumbers(grid[0])).toEqual([3, 3, 3, 3, 4, 4, 4]);
        expect(dayNumbers(grid[5])).toEqual([1, 2, 3, 4, 5, 6, 7]);
        expect(monthNumbers(grid[5])).toEqual([5, 5, 5, 5, 5, 5, 5]);
    });

    it('uses null placeholders when bounding month dates are disabled', (): void => {
        const grid = service.createDaysGrid(new Date('2026-05-15T00:00:00'), false, 1);

        expect(grid[0].slice(0, 4)).toEqual([null, null, null, null]);
        expect(dayNumbers(grid[0].slice(4))).toEqual([1, 2, 3]);
        expect(grid[5]).toEqual([null, null, null, null, null, null, null]);
    });
});

const nativeDateService = (): unknown => ({
    DAYS_IN_WEEK: 7,
    addMonth: (date: Date, months: number): Date => new Date(date.getFullYear(), date.getMonth() + months, 1),
    createDate: (year: number, month: number, date: number): Date => new Date(year, month, date),
    getDayOfWeek: (date: Date): number => date.getDay(),
    getFirstDayOfWeek: (): number => 0,
    getMonth: (date: Date): number => date.getMonth(),
    getMonthStart: (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1),
    getNumberOfDaysInMonth: (date: Date): number => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    getYear: (date: Date): number => date.getFullYear(),
});

const dayNumbers = (dates: Array<Date | null>): Array<number | null> =>
    dates.map((date: Date | null): number | null => date?.getDate() ?? null);

const monthNumbers = (dates: Array<Date | null>): Array<number | null> =>
    dates.map((date: Date | null): number | null => date?.getMonth() ?? null);
