export class DateUtil {
    public static endOfTheDay(date: Date): Date {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);

        return d;
    }
}
