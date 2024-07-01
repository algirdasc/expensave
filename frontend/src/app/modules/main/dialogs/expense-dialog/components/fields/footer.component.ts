import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Expense } from '../../../../../../api/objects/expense';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { ExpenseDialogComponent } from '../../expense-dialog.component';

@Component({
    selector: 'app-expense-dialog-footer',
    template: `<div class="d-flex flex-row-reverse justify-content-between p-3 border-top">
        <button nbButton type="submit" status="primary" [disabled]="!form.valid || !submitEnabled" tabIndex="3">
            <nb-icon icon="save-outline"></nb-icon>
            Save
        </button>

        <button nbButton type="button" ghost status="danger" *ngIf="expense.id" (click)="deleteExpense()">
            <nb-icon icon="trash-2-outline"></nb-icon>
        </button>
    </div>`,
})
export class FooterComponent {
    @Input({ required: true })
    public form: NgForm;

    @Input({ required: true })
    public expense: Expense;

    @Input()
    public submitEnabled: boolean = true;

    @Output()
    public delete: EventEmitter<void> = new EventEmitter<void>();

    public constructor(private dialogService: NbDialogService) {}

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
