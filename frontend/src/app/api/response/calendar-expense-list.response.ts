import {Expose, Type} from 'class-transformer';
import {Calendar} from '../entities/calendar.entity';
import {Expense} from '../entities/expense.entity';

export class CalendarExpenseListResponse  {
    @Expose()
    @Type(() => Expense)
    public expenses: Expense[];

    @Expose()
    @Type(() => Balance)
    public balances: Balance[];

    @Expose()
    @Type(() => Calendar)
    public calendar: Calendar;
}

export class Balance {
    @Expose()
    @Type(() => Date)
    public balanceAt: Date;

    @Expose()
    public balance: number;

    @Expose()
    public expenses: number;
}
