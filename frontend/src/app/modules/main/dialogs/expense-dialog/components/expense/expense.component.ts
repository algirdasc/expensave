import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ExpenseApiService } from '../../../../../../api/expense.api.service';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-expense',
    templateUrl: 'expense.component.html',
})
export class ExpenseComponent extends AbstractExpenseComponent {
    public constructor(
        private expenseApiService: ExpenseApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onSubmit(): void {
        this.expenseApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }

    public onDelete(): void {
        this.expenseApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
    }
}
