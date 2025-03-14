import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slideAnimation } from '../../../../../animations/slide.animation';
import { Calendar } from '../../../../../api/objects/calendar';
import { NbCardModule, NbButtonModule, NbIconModule, NbListModule } from '@nebular/theme';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-calendar-list',
    templateUrl: 'calendar-list.component.html',
    styleUrls: ['calendar-list.component.scss'],
    animations: slideAnimation,
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbListModule, NgFor],
})
export class CalendarListComponent {
    @Input() public calendars: Calendar[];
    @Input() public selectedCalendar: Calendar;
    @Output() public calendarClick: EventEmitter<Calendar> = new EventEmitter<Calendar>();
    @Output() public newCalendarClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();

    public isActive(calendar: Calendar): boolean {
        return calendar.id === this.selectedCalendar?.id;
    }
}
