import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ExpenseApiService } from '../../../../../api/expense.api.service';
import { Expense } from '../../../../../api/objects/expense';
import { NbButtonModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NgIf } from '@angular/common';
import { SuggestionComponent } from '../../../components/suggestion/suggestion.component';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';

@Component({
    selector: 'app-expense-input',
    templateUrl: 'expense-input.component.html',
    styleUrl: 'expense-input.component.scss',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [NbButtonModule, NbIconModule, NbInputModule, FormsModule, NgIf, SuggestionComponent, ShortNumberPipe],
})
export class ExpenseInputComponent {
    @Input({ required: true })
    public expense: Expense;

    @Output()
    public expenseChange: EventEmitter<Expense> = new EventEmitter<Expense>();

    @Input()
    public labelEditable: boolean = true;

    @ViewChild('focusElement')
    private focusElement: ElementRef;

    public suggestedExpense: Expense;

    private expenseSuggestionSubscription: Subscription;

    public constructor(
        private expenseApiService: ExpenseApiService,
        private cd: ChangeDetectorRef
    ) {}

    public handleInputChange(input: string): void {
        // 1. Cancel pending suggestion request
        if (this.expenseSuggestionSubscription) {
            this.expenseSuggestionSubscription.unsubscribe();
        }

        // 2. Do not look for suggestion on empty input
        if (!input) {
            return;
        }

        // 3. Search for suggestions
        this.expenseSuggestionSubscription = this.expenseApiService.suggest(input).subscribe((response: Expense) => {
            this.suggestedExpense = response;
        });
    }

    public applyLabelSuggestion(): void {
        this.expense.label = this.suggestedExpense.label;
        this.expense.category = this.suggestedExpense.category;
        // this.expense.isExpense = this.suggestedExpense.isExpense;

        this.cd.detectChanges();
    }

    public stealFocus(): void {
        setTimeout(() => this.focusElement.nativeElement.focus(), 0);
    }
}
