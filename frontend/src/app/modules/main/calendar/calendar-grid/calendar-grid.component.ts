import {Component, Input, Type} from '@angular/core';
import {NbCalendarPickerComponent} from '@nebular/theme';
import {Balance} from '../../../../api/objects/balance';
import {Calendar} from '../../../../api/objects/calendar';
import {Expense} from '../../../../api/objects/expense';
import {CalendarCellInterface} from '../interfaces/calendar-cell.interface';

@Component({
    selector: 'app-calendar-grid',
    styleUrls: ['calendar-grid.component.scss'],
    templateUrl: 'calendar-grid.component.html'
})
export class CalendarGridComponent extends NbCalendarPickerComponent<Date, Date> {
    @Input({required: true}) public expenses: Expense[];
    @Input({required: true}) public balances: Balance[];
    @Input({required: true}) public calendar: Calendar;

    public cellComponent: Type<CalendarCellInterface>;

    public onSelect(date: Date): void {
        this.select.emit(date);
    }
}
