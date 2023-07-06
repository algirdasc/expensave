import {Component} from '@angular/core';
import {Expense} from '../../../../api/entities/expense.entity';
import {ExpenseApiService} from '../../../../api/expense.api.service';
import {NbDialogRef} from '@nebular/theme';

@Component({
    templateUrl: 'expense-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss']
})
export class ExpenseDialogComponent {
    public expense: Expense;
    public isBusy: boolean = false;

    constructor(
        private readonly expenseApiService: ExpenseApiService,
        private readonly dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) { }

    public onSubmit(): void {
        this.expenseApiService
            .save(this.expense)
            .subscribe((expense: Expense) => {
                this.dialogRef.close(expense);
            })
        ;
    }
}