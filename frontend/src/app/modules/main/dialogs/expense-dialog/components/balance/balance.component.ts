import { Component, Input, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BalanceUpdateApiService } from '../../../../../../api/balance-update.api.service';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';
import { ExpenseInputComponent } from '../expense-input.component';

@Component({
    selector: 'app-balance',
    templateUrl: 'balance.component.html',
})
export class BalanceComponent extends AbstractExpenseComponent {
    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    @Input()
    public deletable: boolean = true;

    public constructor(
        private balanceApiService: BalanceUpdateApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.balanceApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    @Input()
    public onSubmit(): void {
        this.balanceApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }

    @Input()
    public onDelete(): void {
        this.balanceApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
