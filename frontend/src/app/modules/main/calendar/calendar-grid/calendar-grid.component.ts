import {Component, Input, Type} from '@angular/core';
import {NbCalendarPickerComponent} from '@nebular/theme';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {Expense} from '../../../../api/entities/expense.entity';
import {Balance} from '../../../../api/response/calendar-expense-list.response';
import {CalendarCellInterface} from '../interfaces/calendar-cell.interface';

@Component({
    selector: 'app-calendar-grid',
    styleUrls: ['calendar-grid.component.scss'],
    templateUrl: 'calendar-grid.component.html'
})
export class CalendarGridComponent extends NbCalendarPickerComponent<Date, Date> {
    @Input() public expenses: Expense[];
    @Input() public balances: Balance[];
    @Input() public calendar: Calendar;

    public cellComponent: Type<CalendarCellInterface>;

    public onSelect(date: Date): void {
        this.select.emit(date);
    }
}
