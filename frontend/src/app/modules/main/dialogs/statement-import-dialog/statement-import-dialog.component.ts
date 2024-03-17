import {Component, Input} from '@angular/core';
import {Calendar} from '../../../../api/entities/calendar.entity';

@Component({
    templateUrl: 'statement-import-dialog.component.html',
    styleUrls: ['statement-import-dialog.component.scss'],
})
export class StatementImportDialogComponent {
    @Input() public calendar: Calendar;
    public isBusy: boolean = false;

    public onSubmit(event): void
    {
        // TODO
    }
}
