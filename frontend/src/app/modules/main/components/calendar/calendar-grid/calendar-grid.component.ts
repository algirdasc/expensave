import { Component, Input } from '@angular/core';
import { NbCalendarPickerComponent } from '@nebular/theme';
import { CalendarGridRowComponent } from '../calendar-grid-row/calendar-grid-row.component';
import { CalendarExpenseListResponse } from '../../../../../api/response/calendar-expense-list.response';

@Component({
    selector: 'app-calendar-grid',
    templateUrl: 'calendar-grid.component.html',
    imports: [CalendarGridRowComponent],
})
export class CalendarGridComponent extends NbCalendarPickerComponent<Date, Date> {
    @Input() expenseData: CalendarExpenseListResponse;
}
