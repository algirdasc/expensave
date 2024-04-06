import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {CalendarApiService} from '../../../../api/calendar.api.service';
import {Calendar} from '../../../../api/objects/calendar';

@Component({
    templateUrl: 'calendars-dialog.component.html',
    styleUrls: ['calendars-dialog.component.scss'],
})
export class CalendarsDialogComponent implements OnInit {
    public isBusy: boolean = true;
    public calendars: Calendar[];
    public selectedCalendar: Calendar;
    public editableCalendar: Calendar;

    public constructor(
        public readonly dialogRef: NbDialogRef<CalendarsDialogComponent>,
        private readonly calendarApiService: CalendarApiService
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngOnInit(): void {
        this.fetch();
    }

    public editCalendar(calendar?: Calendar): void {
        this.editableCalendar = calendar ?? new Calendar();
    }

    public saveCalendar(calendar: Calendar): void {
        this.calendarApiService
            .save(calendar)
            .subscribe(() => {
                this.editableCalendar = undefined;
                this.fetch();
            })
        ;
    }

    public fetch(): void {
        this.calendarApiService
            .list()
            .subscribe((calendars: Calendar[]) => this.calendars = calendars)
        ;
    }
}
