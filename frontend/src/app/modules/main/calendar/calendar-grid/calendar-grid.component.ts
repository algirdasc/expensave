import {Component, Input} from '@angular/core';
import {NbCalendarPickerComponent} from '@nebular/theme';
import {ResizedEvent} from 'angular-resize-event';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {Expense} from '../../../../api/entities/expense.entity';

@Component({
    selector: 'app-calendar-grid',
    styleUrls: ['calendar-grid.component.scss'],
    templateUrl: 'calendar-grid.component.html'
})
export class CalendarGridComponent extends NbCalendarPickerComponent<any, any> {
    @Input() public expenses: Expense[];
    @Input() public calendar: Calendar;
    public resizedEvent: ResizedEvent;
}
