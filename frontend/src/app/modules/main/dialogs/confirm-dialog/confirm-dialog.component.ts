import { Component } from '@angular/core';
import { NbDialogRef, NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';

@Component({
    templateUrl: 'confirm-dialog.component.html',
    styleUrls: ['confirm-dialog.component.scss'],
    imports: [NbCardModule, NbButtonModule, NbIconModule],
})
export class ConfirmDialogComponent {
    public question: string = 'Are you sure?';
    public yesText: string = 'Yes';
    public noText: string = 'No';

    public constructor(public dialogRef: NbDialogRef<ConfirmDialogComponent>) {}
}
