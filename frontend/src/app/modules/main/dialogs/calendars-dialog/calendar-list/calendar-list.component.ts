import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Calendar} from '../../../../../api/entities/calendar.entity';

@Component({
  selector: 'app-calendar-list',
  templateUrl: 'calendar-list.component.html',
  styleUrls: ['calendar-list.component.scss'],
})
export class CalendarListComponent {
  @Input() public calendars: Calendar[];
  @Input() public selectedCalendar: Calendar;
  @Output() public calendarClick: EventEmitter<Calendar> = new EventEmitter<Calendar>();
  @Output() public newCalendarClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isActive(calendar: Calendar): boolean {
    return calendar.id === this.selectedCalendar?.id;
  }
}
