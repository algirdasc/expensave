import {NbCalendarCell} from '@nebular/theme';
import {Balance} from '../../../../api/objects/balance';
import {Calendar} from '../../../../api/objects/calendar';
import {Expense} from '../../../../api/objects/expense';

export interface CalendarCellInterface extends NbCalendarCell<Date, Date> {
    expenses: Expense[];
    balance: Balance;
    calendar: Calendar;
    hasUnconfirmedExpenses: boolean;
}
