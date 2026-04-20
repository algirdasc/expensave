import { Component } from '@angular/core';
import { NbCalendarDayCellComponent } from '@nebular/theme';
import { Calendar } from '../../../../../api/objects/calendar';
import { Expense } from '../../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../../api/objects/expense-balance';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';
import { CalendarCellInterface } from '../interfaces/calendar-cell.interface';

@Component({
    templateUrl: 'calendar-grid-row-cell-mobile.component.html',
    styleUrls: ['calendar-grid-row-cell-mobile.component.scss'],
    imports: [ShortNumberPipe],
})
export class CalendarGridRowCellMobileComponent
    extends NbCalendarDayCellComponent<Date>
    implements CalendarCellInterface
{
    expenses: Expense[];
    balance: ExpenseBalance;
    calendar: Calendar;
    hasUnconfirmedExpenses: boolean = false;

    get isCellSelected(): boolean {
        return this.dateService.isSameDaySafe(this.selectedValue, this.date);
    }
}
