import { Component } from '@angular/core';
import { AbstractExpenseComponent } from './abstract-expense.component';

@Component({
    selector: 'app-expense',
    templateUrl: 'expense.component.html',
})
export class ExpenseComponent extends AbstractExpenseComponent {}
