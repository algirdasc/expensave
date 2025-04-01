import { Component } from '@angular/core';
import { NbCalendarDaysNamesComponent } from '@nebular/theme';
import { NgFor } from '@angular/common';

@Component({
    templateUrl: 'calendar-day-names.component.html',
    styleUrls: ['calendar-day-names.component.scss'],
    selector: 'app-calendar-day-names',
    standalone: true,
    imports: [NgFor],
})
export class CalendarDayNamesComponent extends NbCalendarDaysNamesComponent<Date> {}
