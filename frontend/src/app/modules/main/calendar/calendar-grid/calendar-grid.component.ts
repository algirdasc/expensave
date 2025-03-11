import { Component, Input, Type } from '@angular/core';
import { NbCalendarPickerComponent } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { Expense } from '../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { CalendarCellInterface } from '../interfaces/calendar-cell.interface';

@Component({
    selector: 'app-calendar-grid',
    styleUrls: ['calendar-grid.component.scss'],
    templateUrl: 'calendar-grid.component.html',
    standalone: false
})
export class CalendarGridComponent extends NbCalendarPickerComponent<Date, Date> {
    @Input({ required: true }) public expenses: Expense[];
    @Input({ required: true }) public expenseBalances: ExpenseBalance[];
    @Input({ required: true }) public calendar: Calendar;

    public cellComponent: Type<CalendarCellInterface>;

    public onSelect(date: Date): void {
        this.select.emit(date);
    }
}
