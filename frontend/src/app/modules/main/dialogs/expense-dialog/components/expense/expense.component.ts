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
    }

    public onSubmit(): void {
        this.expenseApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }
}
