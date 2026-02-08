import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbButtonModule, NbDialogService, NbIconModule } from '@nebular/theme';
import { Expense } from '../../../../../../api/objects/expense';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-expense-dialog-footer',
    template: `<div class="d-flex flex-row-reverse justify-content-between p-3 border-top">
        <button nbButton type="submit" status="primary" [disabled]="!form.valid || !submitEnabled" tabIndex="3">
            <nb-icon icon="save-outline"></nb-icon>
            Save
        </button>

        @if (deletable) {
            <button nbButton type="button" ghost status="danger" (click)="deleteExpense()">
                <nb-icon icon="trash-2-outline"></nb-icon>
            </button>
        }
    </div>`,
    imports: [NbButtonModule, NbIconModule],
})
export class FooterComponent {
    private dialogService = inject(NbDialogService);

    @Input({ required: true })
    public form: NgForm;

    @Input({ required: true })
    public expense: Expense;

    @Input()
    public deletable: boolean = true;

    @Input()
    public submitEnabled: boolean = true;

    @Output()
    public delete: EventEmitter<void> = new EventEmitter<void>();

    public deleteExpense(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: 'Are you sure you want delete this transaction?',
                },
            })
            .onClose.subscribe((result?: boolean) => {
                if (result) {
                    this.delete.emit();
                }
            });
    }
}
