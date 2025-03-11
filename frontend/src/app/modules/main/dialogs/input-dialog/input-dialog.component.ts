import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NbDialogRef, NbCardModule, NbButtonModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: 'input-dialog.component.html',
    styleUrls: ['input-dialog.component.scss'],
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbInputModule, FormsModule],
})
export class InputDialogComponent implements AfterViewInit {
    @Input()
    public title: string = 'Input dialog';

    @Input()
    public placeholder: string = '';

    @Input()
    public text: string;

    @ViewChild('focus')
    private focusElement: ElementRef;

    public constructor(public readonly dialogRef: NbDialogRef<InputDialogComponent>) {}

    public ngAfterViewInit(): void {
        this.focusElement.nativeElement.focus();
    }
}
