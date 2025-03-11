import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    templateUrl: 'datepicker-dialog.component.html',
    styleUrls: ['datepicker-dialog.component.scss'],
    standalone: false,
})
export class DatepickerDialogComponent {
    @Input() public date: Date;

    public constructor(public dialogRef: NbDialogRef<DatepickerDialogComponent>) {}
}
