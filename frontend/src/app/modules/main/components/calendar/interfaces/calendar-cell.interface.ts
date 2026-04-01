import { Expense } from '../../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../../api/objects/expense-balance';
import { Calendar } from '../../../../../api/objects/calendar';
import { NbCalendarCell } from '@nebular/theme';

export interface CalendarCellInterface extends NbCalendarCell<Date, Date> {
    expenses: Expense[];
    balance: ExpenseBalance;
    calendar: Calendar;
}
