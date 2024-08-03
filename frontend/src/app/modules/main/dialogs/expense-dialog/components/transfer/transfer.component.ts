import { Component, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ExpenseApiService } from '../../../../../../api/expense.api.service';
import { Calendar } from '../../../../../../api/objects/calendar';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';
import { ExpenseInputComponent } from '../expense-input.component';

@Component({
    selector: 'app-transfer',
    templateUrl: 'transfer.component.html',
})
export class TransferComponent extends AbstractExpenseComponent {
    public destinationCalendar: Calendar;

    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    public constructor(
        private expenseApiService: ExpenseApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onSubmit(): void {
        const transferExpense = plainToInstance(Expense, instanceToPlain(this.expense));

        transferExpense.calendar = this.destinationCalendar;
        transferExpense.amount = -1 * transferExpense.amount;

        this.expenseApiService.save(this.expense).subscribe(() => {
            this.expenseApiService.save(transferExpense).subscribe(() => {
                this.dialogRef.close(true);
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
