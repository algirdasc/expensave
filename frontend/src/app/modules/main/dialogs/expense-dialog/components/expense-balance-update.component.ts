import { Component } from '@angular/core';
import { AbstractExpenseComponent } from './abstract-expense.component';

@Component({
    selector: 'app-expense-balance-update',
    templateUrl: 'expense-balance-update.component.html',
})
export class ExpenseBalanceUpdateComponent extends AbstractExpenseComponent {}
