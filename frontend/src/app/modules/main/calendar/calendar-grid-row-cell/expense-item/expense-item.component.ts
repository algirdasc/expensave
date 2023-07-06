import {Component, Input} from '@angular/core';
import {Expense} from '../../../../../api/entities/expense.entity';

@Component({
    templateUrl: 'expense-item.component.html',
    styleUrls: ['expense-item.component.scss'],
    selector: 'app-calendar-expense-item'
})
export class ExpenseItemComponent {
    @Input() public expense: Expense;
}