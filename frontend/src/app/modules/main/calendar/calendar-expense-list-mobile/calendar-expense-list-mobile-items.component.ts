import { Component, Input } from '@angular/core';
import { Expense } from '../../../../api/objects/expense';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';
import { CalendarService } from '../calendar.service';

@Component({
    selector: 'app-calendar-expense-list-mobile-items',
    styleUrl: 'calendar-expense-list-mobile-items.component.scss',
    template: ` <div class="d-flex justify-content-between mb-1 px-1">
            <small class="text-muted"
                >{{ confirmed ? 'Spent on' : 'Planned for' }} {{ selectedValue | date: 'MMMM dd, EEEE' }}</small
            >
            <small>{{ expensesSum | shortNumber }}</small>
        </div>
        <nb-list>
            <nb-list-item
                *ngFor="let expense of expenses"
                [style.background-color]="expense.category?.color ?? UNCATEGORIZED_COLOR"
                [class.expense-unconfirmed]="!confirmed"
                (click)="calendarService.editExpense(expense)"
                class="mb-2 rounded actionable">
                <nb-icon class="flex-shrink-0" icon="{{ expense.category?.icon }}pricetags-outline"></nb-icon>
                <div class="text-truncate w-100">
                    <strong class="mx-2">{{ expense.amount | shortNumber }}</strong>
                    <span>{{ expense.label }}</span>
                </div>
                <small class="w-50 text-right text-truncate">{{ expense.category?.name }}</small>
            </nb-list-item>
        </nb-list>`,
    standalone: false
})
export class CalendarExpenseListMobileItemsComponent {
    @Input()
    protected expenses: Expense[];

    @Input()
    protected selectedValue: Date;

    @Input()
    protected confirmed: boolean;

    protected readonly UNCATEGORIZED_COLOR = UNCATEGORIZED_COLOR;

    public constructor(protected calendarService: CalendarService) {}

    public get expensesSum(): number {
        let sum = 0;
        this.expenses.forEach((expense: Expense) => (sum += expense.amount));

        return sum;
    }
}
