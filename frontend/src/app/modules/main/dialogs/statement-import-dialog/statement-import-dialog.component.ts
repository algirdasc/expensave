import {Component, Input} from '@angular/core';
import {NbDialogRef, NbToastrService} from '@nebular/theme';
import {CalendarApiService} from '../../../../api/calendar.api.service';
import {Calendar} from '../../../../api/objects/calendar';
import {StatementImportResponse} from '../../../../api/response/statement-import.response';

@Component({
    templateUrl: 'statement-import-dialog.component.html',
    styleUrls: ['statement-import-dialog.component.scss'],
})
export class StatementImportDialogComponent {
    @Input() public calendar: Calendar;

    public isBusy: boolean = false;
    private files: File[] = [];

    constructor(
        public readonly dialogRef: NbDialogRef<StatementImportDialogComponent>,
        private readonly calendarApiService: CalendarApiService,
        private readonly toastrService: NbToastrService,
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public onSubmit(): void
    {
        const formData = new FormData();
        for (const file of this.files) {
            formData.append('statements', file, file.name);
        }

        this.calendarApiService
            .importStatements(this.calendar, formData)
            .subscribe((response: StatementImportResponse) => {
                console.log(response);
            });
    }

    public onChange(event: any): void
    {
        console.log(event);
        this.files = event.target.files;
    }
}
