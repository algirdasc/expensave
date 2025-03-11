import { Component, Input } from '@angular/core';
import { NbDialogRef, NbCardModule, NbButtonModule, NbIconModule, NbCalendarModule } from '@nebular/theme';

@Component({
    templateUrl: 'datepicker-dialog.component.html',
    styleUrls: ['datepicker-dialog.component.scss'],
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbCalendarModule],
})
export class DatepickerDialogComponent {
    @Input() public date: Date;

    public constructor(public dialogRef: NbDialogRef<DatepickerDialogComponent>) {}
}
