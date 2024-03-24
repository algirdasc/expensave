import {NbCalendarCell} from '@nebular/theme';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {Expense} from '../../../../api/entities/expense.entity';
import {Balance} from '../../../../api/response/calendar-expense-list.response';

export interface CalendarCellInterface extends NbCalendarCell<Date, Date> {
    expenses: Expense[];
    balance: Balance;
    calendar: Calendar;
}
