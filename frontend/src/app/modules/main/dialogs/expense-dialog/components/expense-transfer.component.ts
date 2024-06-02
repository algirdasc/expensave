import { Component } from '@angular/core';
import { AbstractExpenseComponent } from './abstract-expense.component';

@Component({
    selector: 'app-expense-transfer',
    template: `transfer`,
})
export class ExpenseTransferComponent extends AbstractExpenseComponent {}
