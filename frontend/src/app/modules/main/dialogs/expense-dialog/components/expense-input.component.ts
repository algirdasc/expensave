import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { Expense } from '../../../../../api/objects/expense';
import { NbButtonModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { SuggestionComponent } from '../../../components/suggestion/suggestion.component';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ExpenseQueries } from '../../../../../queries/expense.queries';

@Component({
    selector: 'app-expense-input',
    templateUrl: 'expense-input.component.html',
    styleUrl: 'expense-input.component.scss',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [NbButtonModule, NbIconModule, NbInputModule, FormsModule, SuggestionComponent, ShortNumberPipe],
})
export class ExpenseInputComponent {
    @Input({ required: true })
    public expense: Expense;

    @Input()
    public labelEditable: boolean = true;

    @Output()
    public readonly expenseChange: EventEmitter<Expense> = new EventEmitter<Expense>();

    @ViewChild('focusElement')
    private focusElement: ElementRef;

    public suggestedExpense: Expense;

    private readonly cd = inject(ChangeDetectorRef);
    private readonly queryClient = inject(QueryClient);
    private readonly expenseQueries = inject(ExpenseQueries);
    private suggestionRequestId = 0;

    public handleInputChange(input: string): void {
        const requestId = ++this.suggestionRequestId;

        // 1. Do not look for suggestion on empty input
        if (!input) {
            this.suggestedExpense = undefined;
            return;
        }

        // 2. Search for suggestions with stale-response protection
        void this.queryClient
            .fetchQuery(this.expenseQueries.suggest(input))
            .then((response: Expense) => {
                if (requestId === this.suggestionRequestId) {
                    this.suggestedExpense = response;
                }
            })
            .catch(() => undefined);
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
