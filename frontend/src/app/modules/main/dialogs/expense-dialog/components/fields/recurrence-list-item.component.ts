import { Component, Input, OnChanges } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import {
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbSelectModule,
    NbToggleModule,
} from '@nebular/theme';
import { Expense } from '../../../../../../api/objects/expense';

@Component({
    selector: 'app-expense-dialog-recurrence-list-item',
    template: `<nb-list-item class="border-0 align-items-start">
        <nb-icon icon="repeat-outline" class="mt-1 me-3" [class.active]="expense.recurring"></nb-icon>

        <div class="d-grid gap-2 w-100 overflow-hidden">
            <div class="d-flex align-items-center justify-content-between gap-3 overflow-hidden">
                <div class="overflow-hidden">
                    <div class="text-truncate">{{ expense.recurring ? 'Repeating expense' : 'Repeat expense' }}</div>
                    @if (expense.recurring) {
                        <small class="d-block text-hint text-truncate">{{ recurrenceSummary }}</small>
                    }
                </div>

                <nb-toggle
                    class="recurrence-toggle"
                    status="primary"
                    [disabled]="isExistingRecurringExpense"
                    [checked]="expense.recurring"
                    (checkedChange)="setRecurring($event)">
                </nb-toggle>
            </div>

            @if (expense.recurring) {
                <div class="border-top pt-2 d-grid gap-2">
                    @if (isExistingRecurringExpense) {
                        <div>
                            <small class="d-block text-hint pb-1 text-uppercase">Update</small>
                            <nb-select
                                size="small"
                                name="recurringUpdateScope"
                                fullWidth
                                [(ngModel)]="expense.recurringUpdateScope">
                                <nb-option value="this">Only this expense</nb-option>
                                <nb-option value="future">This and future expenses</nb-option>
                                <nb-option value="past">This and past expenses</nb-option>
                                <nb-option value="all">All related expenses</nb-option>
                            </nb-select>
                        </div>
                    } @else {
                        <div>
                            <small class="d-block text-hint pb-1 text-uppercase">Frequency</small>
                            <nb-form-field>
                                <nb-icon nbPrefix icon="calendar-outline" />
                                <nb-select
                                    size="small"
                                    name="recurringFrequency"
                                    fullWidth
                                    [(ngModel)]="expense.recurringFrequency">
                                    <nb-option value="daily">Daily</nb-option>
                                    <nb-option value="weekly">Weekly</nb-option>
                                    <nb-option value="monthly">Monthly</nb-option>
                                    <nb-option value="yearly">Yearly</nb-option>
                                </nb-select>
                            </nb-form-field>
                        </div>

                        <div>
                            <small class="d-block text-hint pb-1 text-uppercase">Ends after</small>
                            <nb-form-field>
                                <nb-icon nbPrefix icon="hash-outline" />
                                <input
                                    nbInput
                                    fullWidth
                                    fieldSize="small"
                                    type="number"
                                    name="recurringOccurrences"
                                    min="2"
                                    max="120"
                                    required
                                    class="ends-after"
                                    [(ngModel)]="expense.recurringOccurrences" />
                                <span nbSuffix class="text-hint expense-suffix">expenses</span>
                            </nb-form-field>
                        </div>
                    }
                </div>
            }
        </div>
    </nb-list-item>`,
    styles: [
        `
            .ends-after {
                padding-right: 210px !important;
            }

            .expense-suffix {
                padding-right: 300px;
            }

            .recurrence-toggle {
                --toggle-height: 1.625rem;
                --toggle-width: 2.75rem;
                --toggle-outline-width: 0;
                --toggle-switcher-size: 1.5rem;
                --toggle-switcher-icon-size: 0.625rem;
            }
        `,
    ],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [
        FormsModule,
        NbIconModule,
        NbInputModule,
        NbListModule,
        NbSelectModule,
        NbFormFieldModule,
        NbToggleModule,
    ],
})
export class RecurrenceListItemComponent implements OnChanges {
    @Input({ required: true })
    public expense: Expense;

    private openedAsRecurringExpense = false;

    protected get isExistingRecurringExpense(): boolean {
        return Boolean(this.expense.id && this.openedAsRecurringExpense);
    }

    protected get frequencyLabel(): string {
        const frequency = this.expense.recurringFrequency ?? 'monthly';

        return frequency[0].toUpperCase() + frequency.slice(1);
    }

    protected get recurrenceSummary(): string {
        return `Repeats ${this.frequencyLabel.toLowerCase()} for ${this.expense.recurringOccurrences ?? 12} expenses`;
    }

    public ngOnChanges(): void {
        this.openedAsRecurringExpense = this.expense.recurring;
    }

    protected setRecurring(recurring: boolean): void {
        this.expense.recurring = recurring;

        if (this.expense.recurring) {
            this.expense.recurringFrequency ??= 'monthly';
            this.expense.recurringOccurrences ||= 12;
        }
    }

    protected toggleRecurring(): void {
        this.setRecurring(!this.expense.recurring);
    }
}
