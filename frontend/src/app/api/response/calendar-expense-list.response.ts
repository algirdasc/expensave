import {Expose, Type} from 'class-transformer';
import {Balance} from '../objects/balance';
import {Calendar} from '../objects/calendar';
import {Expense} from '../objects/expense';

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

