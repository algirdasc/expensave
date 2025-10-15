import { Component, Input, inject } from '@angular/core';
import { NbDialogRef, NbCardModule, NbButtonModule, NbIconModule, NbCalendarModule } from '@nebular/theme';

@Component({
    templateUrl: 'datepicker-dialog.component.html',
    styleUrls: ['datepicker-dialog.component.scss'],
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbCalendarModule],
})
export class DatepickerDialogComponent {
    public readonly dialogRef = inject<NbDialogRef<DatepickerDialogComponent>>(NbDialogRef);

    @Input() public date: Date;
}
