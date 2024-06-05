import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-expense-transfer',
    templateUrl: 'expense-transfer.component.html',
})
export class ExpenseTransferComponent extends AbstractExpenseComponent {
    constructor(protected dialogService: NbDialogService) {
        super();
    }
}
