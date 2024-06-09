import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ExpenseApiService } from '../../../../../api/expense.api.service';
import { Expense } from '../../../../../api/objects/expense';
import { UNCATEGORIZED_COLOR } from '../../../../../util/color.util';

@Component({
    selector: 'app-expense-input',
    templateUrl: 'expense-input.component.html',
    styleUrl: 'expense-input.component.scss',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class ExpenseInputComponent implements AfterViewInit {
    @Input({ required: true })
    public expense: Expense;

    @Output()
    public expenseChange: EventEmitter<Expense> = new EventEmitter<Expense>();

    @Input()
    public labelEditable: boolean = false;

    // @ViewChild('focus')
    // private focusElement: ElementRef;

    public suggestedExpense: Expense;

    private expenseSuggestionSubscription: Subscription;

    public constructor(private expenseApiService: ExpenseApiService) {}

    public ngAfterViewInit(): void {
        return;
        // this.focusElement.nativeElement.focus();
    }

    public handleInputChange(input: string): void {
        // 1. Deselect category when input change & is not equal to suggestion (new expense only)
        if (this.expense.id === undefined && input !== this.suggestedExpense?.label) {
            this.expense.category = undefined;
        }

        // 2. Cancel pending suggestion request
        if (this.expenseSuggestionSubscription) {
            this.expenseSuggestionSubscription.unsubscribe();
        }

        // 3. Do not look for suggestion on empty input
        if (!input) {
            return;
        }

        // 4. Search for suggestions
        this.expenseSuggestionSubscription = this.expenseApiService.suggest(input).subscribe((response: Expense) => {
            this.suggestedExpense = response;
        });
    }

    public applyLabelSuggestion(): void {
        this.expense.label = this.suggestedExpense.label;
        this.expense.category = this.suggestedExpense.category;
        this.expense.isExpense = this.suggestedExpense.isExpense;
    }

    public backgroundColor(): string {
        return this.expense.confirmed ? this.expense.category?.color ?? UNCATEGORIZED_COLOR : 'transparent';
    }
}
