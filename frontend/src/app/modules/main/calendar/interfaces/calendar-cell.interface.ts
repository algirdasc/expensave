import {NbCalendarCell} from '@nebular/theme';
import {Calendar} from '../../../../api/objects/calendar';
import {Expense} from '../../../../api/objects/expense';
import {ExpenseBalance} from '../../../../api/objects/expense-balance';

export interface CalendarCellInterface extends NbCalendarCell<Date, Date> {
    expenses: Expense[];
    expenseBalance: ExpenseBalance;
    calendar: Calendar;
    hasUnconfirmedExpenses: boolean;
}
