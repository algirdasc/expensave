import { Component, OnInit, inject } from '@angular/core';
import { NbDialogRef, NbToastrService, NbSpinnerModule } from '@nebular/theme';
import { CalendarApiService } from '../../../../api/calendar.api.service';
import { Calendar } from '../../../../api/objects/calendar';
import { NgIf } from '@angular/common';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';

@Component({
    templateUrl: 'calendars-dialog.component.html',
    styleUrls: ['calendars-dialog.component.scss'],
    imports: [NbSpinnerModule, NgIf, CalendarListComponent, CalendarEditComponent],
})
export class CalendarsDialogComponent implements OnInit {
    readonly dialogRef = inject<NbDialogRef<CalendarsDialogComponent>>(NbDialogRef);
    readonly toastrService = inject(NbToastrService);
    private readonly calendarApiService = inject(CalendarApiService);

    public isBusy: boolean = true;
    public calendars: Calendar[];
    public selectedCalendar: Calendar;
    public editableCalendar: Calendar;

    public constructor() {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public ngOnInit(): void {
        this.fetch();
    }

    public editCalendar(calendar?: Calendar): void {
        // TODO: create calendar with user
        this.editableCalendar = calendar ?? new Calendar();
    }

    public saveCalendar(calendar: Calendar): void {
        this.calendarApiService.save(calendar).subscribe(() => {
            this.editableCalendar = undefined;
            this.toastrService.success('Calendar deleted successfully', 'Calendar delete');
            this.fetch();
        });
    }

    public fetch(): void {
        this.calendarApiService.list().subscribe((calendars: Calendar[]) => (this.calendars = calendars));
    }
}
