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
    standalone: false
})
export class BalanceComponent extends AbstractExpenseComponent {
    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    @Input()
    public deletable: boolean = true;

    @Input()
    public onSubmit: () => void;

    @Input()
    public onDelete: () => void;

    public constructor(
        private balanceApiService: BalanceUpdateApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.balanceApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onDefaultSubmit(): void {
        this.balanceApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }

    public onDefaultDelete(): void {
        this.balanceApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
