export class DateUtil {
    static readonly DATE_FORMAT: string = 'yyyy-MM-dd';
    static readonly DATE_TIME_FORMAT: string = 'yyyy-MM-dd HH:mm:ss';
    static readonly MONTH_DAY_FORMAT: string = 'yyyy-MM';

    static endOfTheDay(date: Date): Date {
        const d = new Date(date);
        d.setHours(23, 59, 59);

        return d;
    }

    static setTime(dateA: Date, dateB: Date): Date {
        const d = new Date(dateA);
        d.setHours(dateB.getHours(), dateB.getMinutes(), dateB.getSeconds(), dateB.getMilliseconds());

        return d;
    }

    static valid(date: Date): boolean {
        return date instanceof Date && !isNaN(date.getTime());
    }

    static firstDayOfWeek(date: Date, firstDayOfWeekIndex: number = 0): Date {
        const dayOfWeek = date.getDay();
        const firstDayOfWeek = new Date(date);
        const diff = dayOfWeek - firstDayOfWeekIndex;

        firstDayOfWeek.setDate(date.getDate() - diff);
        firstDayOfWeek.setHours(0, 0, 0, 0);

        return firstDayOfWeek;
    }

    static firstDayOfMonth(date: Date): Date {
        const firstDayOfMonth = new Date(date);
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        return firstDayOfMonth;
    }

    static lastDayOfMonth(date: Date): Date {
        const lastDayOfMonth = new Date(date);
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
        lastDayOfMonth.setDate(0);
        lastDayOfMonth.setHours(23, 59, 59);

        return lastDayOfMonth;
    }
}
