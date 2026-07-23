import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slideAnimation } from '../../../../../animations/slide.animation';
import { Calendar } from '../../../../../api/objects/calendar';
import { NbButtonModule, NbCardModule, NbIconModule, NbListModule, NbTooltipModule } from '@nebular/theme';

@Component({
    selector: 'app-calendar-list',
    templateUrl: 'calendar-list.component.html',
    animations: slideAnimation,
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbListModule, NbTooltipModule],
})
export class CalendarListComponent {
    @Input() public calendars: Calendar[];
    @Output() public readonly calendarClick: EventEmitter<Calendar> = new EventEmitter<Calendar>();
    @Output() public readonly newCalendarClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public readonly back: EventEmitter<boolean> = new EventEmitter<boolean>();
    public selectedCalendarId: number | null = null;

    @Input() public set selectedCalendar(value: Calendar) {
        this.selectedCalendarId = value?.id ?? null;
    }
}
