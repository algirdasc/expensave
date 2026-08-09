import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { slideAnimation } from '../../../../animations/slide.animation';
import { Expense } from '../../../../api/objects/expense';
import { expenseMatchesSearch } from '../../../../util/expense-search.util';
import { MainService } from '../../main.service';
import { NbIconModule, NbListModule } from '@nebular/theme';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';

@Component({
    selector: 'app-expense-list-items',
    template: ` <nb-list>
        <nb-list-item>
            <small class="text-hint w-100">{{ header }}</small>
            <span>{{ totalExpensesAmount | shortNumber }}</span>
        </nb-list-item>
        @for (expense of expenses; track expense.id) {
            <nb-list-item
                [@slideAnimation]
                class="actionable"
                [class.expense-dimmed]="!expenseMatchesSearch(expense, mainService.searchQuery)"
                (click)="expenseClick.emit(expense)">
                <nb-icon
                    [icon]="icon"
                    class="flex-shrink-0 me-2"
                    [style]="{ color: expense.category?.color }"></nb-icon>
                <div class="text-truncate w-100 mx-3">
                    {{ expense.label }}
                    <small class="d-flex align-items-center text-hint">
                        {{ expense.category.name }}
                    </small>
                </div>
                <span>{{ expense.amount | shortNumber }}</span>
            </nb-list-item>
        }
    </nb-list>`,
    animations: slideAnimation,
    styles: `
        nb-list-item {
            transition: opacity 0.15s ease-in-out;
        }

        nb-list-item.expense-dimmed {
            opacity: 0.2;
        }
    `,
    imports: [NbListModule, NbIconModule, ShortNumberPipe],
})
export class ExpenseListItemsComponent implements OnInit {
    @Input({ required: true })
    public expenses: Expense[];

    @Input({ required: true })
    public header: string;

    @Input()
    public icon: string = 'checkmark-circle-2';

    @Output()
    public readonly expenseClick: EventEmitter<Expense> = new EventEmitter<Expense>();

    protected totalExpensesAmount: number = 0;

    protected readonly mainService = inject(MainService);
    protected readonly expenseMatchesSearch = expenseMatchesSearch;

    public ngOnInit(): void {
        this.expenses.forEach((expense: Expense) => {
            this.totalExpensesAmount += expense.amount;
        });
    }
}
