import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BalanceApiService } from '../../../../../../api/balance.api.service';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-balance',
    templateUrl: 'balance.component.html',
})
export class BalanceComponent extends AbstractExpenseComponent {
    public constructor(
        private balanceApiService: BalanceApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();
    }

    public onSubmit(): void {
        this.balanceApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }
}
