import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbButtonModule, NbIconModule, NbListModule, NbRadioModule } from '@nebular/theme';
import { Calendar } from '../../../../../api/objects/calendar';
import { User } from '../../../../../api/objects/user';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';

@Component({
    selector: 'app-sidebar-calendar-list-display',
    templateUrl: 'calendar-list-display.component.html',
    styleUrls: ['calendar-list-display.component.scss'],
    imports: [NbListModule, NbRadioModule, NbIconModule, NbButtonModule, ShortNumberPipe],
})
export class CalendarListDisplayComponent {
    @Input({ required: true }) public calendars: Calendar[];
    @Input({ required: true }) public calendar: Calendar;
    @Input({ required: true }) public user: User;

    @Output() public calendarSelect = new EventEmitter<Calendar>();
    @Output() public makeDefault = new EventEmitter<Calendar>();
    @Output() public editCalendar = new EventEmitter<Calendar>();
    @Output() public deleteCalendar = new EventEmitter<Calendar>();
}
