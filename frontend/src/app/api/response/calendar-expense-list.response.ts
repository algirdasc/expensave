import { Expose, Type } from 'class-transformer';
import { Calendar } from '../objects/calendar';
import { Expense } from '../objects/expense';
import { ExpenseBalance } from '../objects/expense-balance';

export class CalendarExpenseListResponse {
    @Expose()
    @Type(() => Expense)
    public expenses: Expense[];

    @Expose()
    @Type(() => ExpenseBalance)
    public expenseBalances: ExpenseBalance[];

    @Expose()
    @Type(() => Calendar)
    public calendar: Calendar;
}
