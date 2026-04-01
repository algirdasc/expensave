import { inject, Injectable } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { batch, range } from '../components/calendar/helpers/helpers';

@Injectable()
export class CalendarMonthModelService<D> {
    dateService = inject<NbDateService<D>>(NbDateService);

    createDaysGrid(activeMonth: D, boundingMonth: boolean = true, firstDayOfWeek?: number): D[][] {
        const weeks = this.createDates(activeMonth, firstDayOfWeek);
        return this.withBoundingMonths(weeks, activeMonth, boundingMonth);
    }

    createDates(activeMonth: D, firstDayOfWeek?: number): D[][] {
        const days = this.createDateRangeForMonth(activeMonth);
        const startOfWeekDayDiff = this.getStartOfWeekDayDiff(activeMonth, firstDayOfWeek);
        return batch(days, this.dateService.DAYS_IN_WEEK, startOfWeekDayDiff);
    }

    withBoundingMonths(weeks: D[][], activeMonth: D, boundingMonth: boolean): D[][] {
        let withBoundingMonths = weeks;

        if (this.isShouldAddPrevBoundingMonth(withBoundingMonths)) {
            withBoundingMonths = this.addPrevBoundingMonth(withBoundingMonths, activeMonth, boundingMonth);
        }

        if (this.isShouldAddNextBoundingMonth(withBoundingMonths)) {
            withBoundingMonths = this.addNextBoundingMonth(withBoundingMonths, activeMonth, boundingMonth);
        }

        return withBoundingMonths;
    }

    addPrevBoundingMonth(weeks: D[][], activeMonth: D, boundingMonth: boolean): D[][] {
        const firstWeek = weeks.shift();
        const requiredItems: number = this.dateService.DAYS_IN_WEEK - firstWeek.length;
        firstWeek.unshift(...this.createPrevBoundingDays(activeMonth, boundingMonth, requiredItems));
        return [firstWeek, ...weeks];
    }

    addNextBoundingMonth(weeks: D[][], activeMonth: D, boundingMonth: boolean): D[][] {
        let requiredFrom: number = 0;
        for (let i = 4; i < 6; i++) {
            const week = weeks[i] ?? [];
            const requiredItems: number = this.dateService.DAYS_IN_WEEK - week.length;
            week.push(...this.createNextBoundingDays(activeMonth, boundingMonth, requiredFrom, requiredItems));
            requiredFrom += requiredItems;
            weeks[i] = week;
        }

        return weeks;
    }

    createPrevBoundingDays(activeMonth: D, boundingMonth: boolean, requiredItems: number): D[] {
        const month = this.dateService.addMonth(activeMonth, -1);
        const daysInMonth = this.dateService.getNumberOfDaysInMonth(month);
        return this.createDateRangeForMonth(month)
            .slice(daysInMonth - requiredItems)
            .map(date => (boundingMonth ? date : null));
    }

    createNextBoundingDays(activeMonth: D, boundingMonth: boolean, requiredFrom: number, requiredItems: number): D[] {
        const month = this.dateService.addMonth(activeMonth, 1);
        return this.createDateRangeForMonth(month)
            .slice(requiredFrom, requiredFrom + requiredItems)
            .map(date => (boundingMonth ? date : null));
    }

    getStartOfWeekDayDiff(date: D, firstDayOfWeek?: number): number {
        const startOfMonth = this.dateService.getMonthStart(date);
        return this.getWeekStartDiff(startOfMonth, firstDayOfWeek);
    }

    getWeekStartDiff(date: D, firstDayOfWeek?: number): number {
        const weekOfset = firstDayOfWeek ?? this.dateService.getFirstDayOfWeek();
        return (7 - weekOfset + this.dateService.getDayOfWeek(date)) % 7;
    }

    isShouldAddPrevBoundingMonth(weeks: D[][]): boolean {
        return weeks[0].length < this.dateService.DAYS_IN_WEEK;
    }

    isShouldAddNextBoundingMonth(weeks: D[][]): boolean {
        return weeks.length < 6 || weeks[weeks.length - 1].length < this.dateService.DAYS_IN_WEEK;
    }

    createDateRangeForMonth(date: D): D[] {
        const daysInMonth: number = this.dateService.getNumberOfDaysInMonth(date);

        return range(daysInMonth, i => {
            const year = this.dateService.getYear(date);
            const month = this.dateService.getMonth(date);
            return this.dateService.createDate(year, month, i + 1);
        });
    }
}
