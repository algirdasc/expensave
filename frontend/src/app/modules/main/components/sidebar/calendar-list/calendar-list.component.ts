import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NbSpinnerModule, NbToastrService } from '@nebular/theme';
import { CalendarApiService } from '../../../../../api/calendar.api.service';
import { Calendar } from '../../../../../api/objects/calendar';
import { UserApiService } from '../../../../../api/user.api.service';
import { MainService } from '../../../main.service';
import { CalendarListActionsComponent } from './calendar-list-actions.component';
import { CalendarListDisplayComponent } from './calendar-list-display.component';

@Component({
    selector: 'app-sidebar-calendar-list',
    template: `
        <div [nbSpinner]="isBusy">
            <app-sidebar-calendar-list-display
                [calendars]="calendars"
                [calendar]="calendar"
                [user]="mainService.user"
                (calendarSelect)="calendarChange.emit($event)"
                (makeDefault)="onMakeDefault($event)"
                (editCalendar)="calendarActions.editCalendar($event)"
                (deleteCalendar)="calendarActions.deleteCalendar($event)">
            </app-sidebar-calendar-list-display>
            <app-sidebar-calendar-list-actions #calendarActions
                [user]="mainService.user"
                (calendarsChange)="onCalendarsChange($event)">
            </app-sidebar-calendar-list-actions>
        </div>
    `,
    imports: [NbSpinnerModule, CalendarListDisplayComponent, CalendarListActionsComponent],
})
export class CalendarSidebarListComponent {
    public readonly mainService = inject(MainService);
    private readonly calendarApiService = inject(CalendarApiService);
    private readonly userApiService = inject(UserApiService);
    private readonly toastrService = inject(NbToastrService);

    @Input() public calendar: Calendar;
    @Output() public calendarChange = new EventEmitter<Calendar>();

    @Input() public calendars: Calendar[];
    @Output() public calendarsChange = new EventEmitter<Calendar[]>();

    public isBusy: boolean = false;

    public constructor() {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onMakeDefault(calendar: Calendar): void {
        this.userApiService.defaultCalendar(calendar).subscribe(() => {
            this.calendarChange.emit(calendar);
            this.toastrService.success(
                `Calendar '${calendar.name}' is now default`,
                'You changed your default calendar'
            );
        });
    }

    public onCalendarsChange(calendars: Calendar[]): void {
        this.calendars = calendars;
        this.calendarsChange.emit(calendars);
    }
}
