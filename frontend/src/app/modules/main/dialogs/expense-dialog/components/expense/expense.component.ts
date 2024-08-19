import { Component, Input, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ExpenseApiService } from '../../../../../../api/expense.api.service';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';
import { ExpenseInputComponent } from '../expense-input.component';

@Component({
    selector: 'app-expense',
    templateUrl: 'expense.component.html',
})
export class ExpenseComponent extends AbstractExpenseComponent {
    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    @Input()
    public deletable: boolean = true;

    public constructor(
        private expenseApiService: ExpenseApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    @Input()
    public onSubmit(): void {
        this.expenseApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }

    @Input()
    public onDelete(): void {
        this.expenseApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
