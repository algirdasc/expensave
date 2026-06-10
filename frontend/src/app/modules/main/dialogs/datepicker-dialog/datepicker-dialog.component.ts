import { Component, inject, Input } from '@angular/core';
import { NbButtonModule, NbCalendarModule, NbCardModule, NbDialogRef, NbIconModule } from '@nebular/theme';

@Component({
    templateUrl: 'datepicker-dialog.component.html',
    styleUrls: ['datepicker-dialog.component.scss'],
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbCalendarModule],
})
export class DatepickerDialogComponent {
    @Input() public date: Date;

    public readonly dialogRef = inject<NbDialogRef<DatepickerDialogComponent>>(NbDialogRef);
}
