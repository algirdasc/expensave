import {NbCalendarCell} from '@nebular/theme';
import {Balance} from '../../../../api/dataobjects/balance';
import {Calendar} from '../../../../api/dataobjects/calendar';
import {Expense} from '../../../../api/dataobjects/expense';

export interface CalendarCellInterface extends NbCalendarCell<Date, Date> {
    expenses: Expense[];
    balance: Balance;
    calendar: Calendar;
    hasUnconfirmedExpenses: boolean;
}
