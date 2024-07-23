import { Component, Input } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CalendarApiService } from '../../../../api/calendar.api.service';
import { Calendar } from '../../../../api/objects/calendar';
import { StatementImportResponse } from '../../../../api/response/statement-import.response';
import { IMPORT_COUNT_KEY, IMPORT_KEY } from '../../modules/statement-import/statement-import.service';

@Component({
    templateUrl: 'statement-import-dialog.component.html',
    styleUrl: 'statement-import-dialog.component.scss',
})
export class StatementImportDialogComponent {
    @Input() public calendar: Calendar;

    public isBusy: boolean = false;
    private files: FileList;

    public constructor(
        public readonly dialogRef: NbDialogRef<StatementImportDialogComponent>,
        private readonly calendarApiService: CalendarApiService,
        private readonly toastrService: NbToastrService
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onSubmit(): void {
        const formData = new FormData();
        const file = this.files[0];
        formData.append('statement', file, file.name);

        this.calendarApiService
            .importStatements(this.calendar, formData)
            .subscribe((response: StatementImportResponse) => {
                if (response.expenses.length === 0) {
                    return this.toastrService.info('Statement file does not contain any records. Want to try again?');
                }

                sessionStorage.setItem(IMPORT_KEY, JSON.stringify(response.expenses));
                sessionStorage.setItem(IMPORT_COUNT_KEY, response.expenses.length.toString());

                this.dialogRef.close(response.expenses.length);
            });
    }

    public onChange(event: Event): void {
        this.files = (event.target as HTMLInputElement).files;
    }
}
