import {Component} from '@angular/core';
import {NbCalendarDaysNamesComponent} from '@nebular/theme';

@Component({
    templateUrl: 'calendar-day-names.component.html',
    styleUrls: ['calendar-day-names.component.scss'],
    selector: 'app-calendar-day-names',
})
export class CalendarDayNamesComponent extends NbCalendarDaysNamesComponent<Date> {
}
