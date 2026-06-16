import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogRef,
    NbIconModule,
    NbInputModule,
    NbTooltipModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: 'input-dialog.component.html',
    styleUrls: ['input-dialog.component.scss'],
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule, FormsModule],
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

    public readonly dialogRef = inject<NbDialogRef<InputDialogComponent>>(NbDialogRef);

    public ngAfterViewInit(): void {
        this.focusElement.nativeElement.focus();
    }
}
