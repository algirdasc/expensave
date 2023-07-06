import {Component} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {CalendarApiService} from '../../../../api/calendar.api.service';
import {Calendar} from '../../../../api/entities/calendar.entity';

@Component({
    templateUrl: 'calendar-dialog.component.html',
    styleUrls: ['calendar-dialog.component.scss']
})
export class CalendarDialogComponent {
    public calendar: Calendar;
    public isBusy: boolean = false;

    constructor(
        private readonly calendarApiService: CalendarApiService,
        private readonly dialogRef: NbDialogRef<CalendarDialogComponent>
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public onSubmit(): void {
        this.calendarApiService
            .save(this.calendar)
            .subscribe((calendar: Calendar) => this.dialogRef.close(calendar))
        ;
    }
}