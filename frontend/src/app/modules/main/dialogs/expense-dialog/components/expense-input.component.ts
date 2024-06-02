import { Component, Input } from '@angular/core';
import { Expense } from '../../../../../api/objects/expense';

@Component({
    selector: 'app-expense-input',
    templateUrl: 'expense-input.component.html',
    styleUrl: 'expense-input.component.scss',
})
export class ExpenseInputComponent {
    @Input({ required: true })
    public expense: Expense;

    @Input()
    public labelEditable: boolean = false;
}
