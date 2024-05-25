import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Expense} from '../../../../api/objects/expense';

@Component({
    selector: 'app-expense-list-items',
    styleUrl: 'expense-list-items.component.scss',
    template: ` <nb-list>
        <nb-list-item class="item-header">
            <small class="text-hint w-100">{{ header }}</small>
            <span>{{ totalExpensesAmount | shortNumber }}</span>
        </nb-list-item>
        <nb-list-item
            class="actionable"
            *ngFor="let expense of expenses"
            (click)="expenseClick.emit(expense)">
            <nb-icon
                [icon]="icon"
                class="flex-shrink-0 me-2"
                [ngStyle]="{'color': expense.category?.color}"></nb-icon>
            <div class="text-truncate w-100 mx-3">
                {{ expense.label }}
            </div>
            <span>{{ expense.amount | shortNumber }}</span>
        </nb-list-item>
    </nb-list>`
})
export class ExpenseListItemsComponent implements OnInit {
    @Input({ required: true })
    public expenses: Expense[];

    @Input({ required: true })
    public header: string;

    @Input()
    public icon: string = 'checkmark-circle-2'

    @Output()
    public expenseClick: EventEmitter<Expense> = new EventEmitter<Expense>();

    protected totalExpensesAmount: number = 0;

    public ngOnInit(): void {
        this.expenses.forEach((expense: Expense) => {
            this.totalExpensesAmount += expense.amount;
        });
    }
}
