import { Component, inject } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogRef, NbIconModule } from '@nebular/theme';

@Component({
    templateUrl: 'confirm-dialog.component.html',
    imports: [NbCardModule, NbButtonModule, NbIconModule],
})
export class ConfirmDialogComponent {
    public readonly dialogRef = inject<NbDialogRef<ConfirmDialogComponent>>(NbDialogRef);

    public question: string = 'Are you sure?';
    public yesText: string = 'Yes';
    public noText: string = 'No';
}
