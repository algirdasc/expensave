import {Component} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {Expense} from '../../../../api/entities/expense.entity';
import {EntityUtil} from '../../../../util/entity.util';
import {ExpenseDialogComponent} from '../expense-dialog/expense-dialog.component';

@Component({
    templateUrl: 'expense-list-dialog.component.html',
    styleUrls: ['expense-list-dialog.component.scss']
})
export class ExpenseListDialogComponent {
    public visibleDate: Date;
    public expenses: Expense[];

    constructor(private dialogService: NbDialogService) { }

    public openExpense(expense: Expense): void {
        this.dialogService
            .open(ExpenseDialogComponent, { context: { expense: expense} })
            .onClose
            .subscribe((result?: Expense) => {
                if (result) {
                    EntityUtil.replaceInArray(this.expenses, expense);
                }
            })
        ;
    }
}
