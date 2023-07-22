import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
    templateUrl: 'input-dialog.component.html',
    styleUrls: ['input-dialog.component.scss'],
})
export class InputDialogComponent {
    @Input() public title: string = 'Input dialog';
    @Input() public placeholder: string = '';
    @Input() public text: string;
    @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        public readonly dialogRef: NbDialogRef<InputDialogComponent>
    ) {
    }
}
