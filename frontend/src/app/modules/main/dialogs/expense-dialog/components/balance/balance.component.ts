import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BalanceUpdateApiService } from '../../../../../../api/balance-update.api.service';
import { Expense } from '../../../../../../api/objects/expense';
import { BALANCE_UPDATE_COLOR } from '../../../../../../util/color.util';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-balance',
    templateUrl: 'balance.component.html',
})
export class BalanceComponent extends AbstractExpenseComponent {
    public constructor(
        private balanceApiService: BalanceUpdateApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.balanceApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onSubmit(): void {
        this.balanceApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }

    public onDelete(): void {
        this.balanceApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
    }

    protected readonly BALANCE_UPDATE_COLOR = BALANCE_UPDATE_COLOR;
}
