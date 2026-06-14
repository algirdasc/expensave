import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
    ViewChild,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { Expense } from '../../../../../api/objects/expense';
import { NbButtonModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { SuggestionComponent } from '../../../components/suggestion/suggestion.component';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';
import { injectQuery } from '@tanstack/angular-query-experimental';
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

    private readonly cd = inject(ChangeDetectorRef);
    private readonly expenseQueries = inject(ExpenseQueries);
    private readonly suggestionInput = signal<string>('');
    private readonly suggestionQuery = injectQuery(() => {
        const input = this.suggestionInput().trim();

        return {
            ...this.expenseQueries.suggest(input),
            enabled: !!input,
        };
    });

    public get suggestedExpense(): Expense | undefined {
        return this.suggestionQuery.data();
    }

    public handleInputChange(input: string): void {
        this.suggestionInput.set(input);
    }

    public applyLabelSuggestion(): void {
        if (!this.suggestedExpense) {
            return;
        }

        this.expense.label = this.suggestedExpense.label;
        this.expense.category = this.suggestedExpense.category;
        // this.expense.isExpense = this.suggestedExpense.isExpense;

        this.cd.detectChanges();
    }

    public stealFocus(): void {
        setTimeout(() => this.focusElement.nativeElement.focus(), 0);
    }
}
