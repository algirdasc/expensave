export class DateUtil {

    public static readonly DATE_FORMAT: string = 'yyyy-MM-dd';
    public static readonly MONTH_DAY_FORMAT: string = 'yyyy-MM';

    public static endOfTheDay(date: Date): Date {
        const d = new Date(date);
        d.setHours(23, 59, 59);

        return d;
    }

    public static setTime(dateA: Date, dateB: Date): Date {
        const d = new Date(dateA);
        d.setHours(dateB.getHours(), dateB.getMinutes(), dateB.getSeconds(), dateB.getMilliseconds());

        return d;
    }

    public static valid(date: Date): boolean {
        return date instanceof Date && !isNaN(date.getTime())
    }

    public static firstDayOfWeek(date: Date, firstDayOfWeekIndex: number = 0) {

        const dayOfWeek = date.getDay();
        const firstDayOfWeek = new Date(date);
        const diff = dayOfWeek - firstDayOfWeekIndex;

        firstDayOfWeek.setDate(date.getDate() - diff)
        firstDayOfWeek.setHours(0,0,0,0)

        return firstDayOfWeek
    }
}
