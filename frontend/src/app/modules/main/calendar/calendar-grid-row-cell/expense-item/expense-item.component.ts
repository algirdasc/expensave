import {Component, Input} from '@angular/core';
import {Expense} from '../../../../../api/entities/expense.entity';
import {UNCATEGORIZED_COLOR} from '../../../../../util/color.util';

@Component({
    templateUrl: 'expense-item.component.html',
    styleUrls: ['expense-item.component.scss'],
    selector: 'app-calendar-expense-item'
})
export class ExpenseItemComponent {
    @Input() public expense: Expense;

    protected readonly UNCATEGORIZED_COLOR: string = UNCATEGORIZED_COLOR;
}
