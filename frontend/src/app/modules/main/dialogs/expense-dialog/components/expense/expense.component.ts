import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-expense',
    templateUrl: 'expense.component.html',
})
export class ExpenseComponent extends AbstractExpenseComponent {
    constructor(protected dialogService: NbDialogService) {
        super();
    }
}
