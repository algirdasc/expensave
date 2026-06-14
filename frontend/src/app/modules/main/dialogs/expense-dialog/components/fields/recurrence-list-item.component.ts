import { Component, Input } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbInputModule, NbListModule } from '@nebular/theme';
import { Expense } from '../../../../../../api/objects/expense';

@Component({
    selector: 'app-expense-dialog-recurrence-list-item',
    template: `<nb-list-item class="border-0 recurring-list-item">
        <nb-icon icon="repeat-outline" class="me-3" [class.active]="expense.recurring"></nb-icon>

        <div class="w-100">
            @if (expense.id && expense.recurring) {
                <div class="recurring-edit">
                    <div class="text-truncate">
                        <span>Recurring expense</span>
                        <small class="d-block text-hint">
                            {{ frequencyLabel }} for {{ expense.recurringOccurrences }} expenses
                        </small>
                    </div>

                    <label>
                        <span>Update</span>
                        <select
                            class="form-select form-select-sm"
                            name="recurringUpdateScope"
                            [(ngModel)]="expense.recurringUpdateScope">
                            <option value="this">This occurrence</option>
                            <option value="future">This and future</option>
                            <option value="past">This and past</option>
                            <option value="all">All occurrences</option>
                        </select>
                    </label>
                </div>
            } @else {
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <div class="text-truncate">
                        <span>Repeat expense</span>
                        @if (expense.recurring) {
                            <small class="d-block text-hint">
                                {{ frequencyLabel }} for {{ expense.recurringOccurrences }} expenses
                            </small>
                        }
                    </div>
                    <button
                        nbButton
                        type="button"
                        size="tiny"
                        [status]="expense.recurring ? 'primary' : 'basic'"
                        (click)="toggleRecurring()">
                        {{ expense.recurring ? 'On' : 'Off' }}
                    </button>
                </div>
            }

            @if (!expense.id && expense.recurring) {
                <div class="recurring-controls">
                    <label>
                        <span>Period</span>
                        <select
                            class="form-select form-select-sm"
                            name="recurringFrequency"
                            [(ngModel)]="expense.recurringFrequency">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </label>

                    <label>
                        <span>Length</span>
                        <input
                            nbInput
                            fullWidth
                            size="small"
                            type="number"
                            name="recurringOccurrences"
                            min="2"
                            max="120"
                            required
                            [(ngModel)]="expense.recurringOccurrences" />
                    </label>
                </div>
            }
        </div>
    </nb-list-item>`,
    styles: [
        `
            :host {
                display: block;
            }

            .recurring-list-item {
                align-items: flex-start;
            }

            .recurring-controls {
                display: grid;
                grid-template-columns: minmax(0, 1fr) 96px;
                gap: 0.75rem;
                margin-top: 0.75rem;
            }

            .recurring-edit {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(140px, 176px);
                gap: 0.75rem;
                align-items: center;
            }

            .recurring-controls label,
            .recurring-edit label {
                display: grid;
                gap: 0.25rem;
                margin: 0;
            }

            .recurring-controls span,
            .recurring-edit label span {
                color: var(--text-hint-color);
                font-size: 0.75rem;
            }

            @media (max-width: 420px) {
                .recurring-edit,
                .recurring-controls {
                    grid-template-columns: minmax(0, 1fr);
                }
            }
        `,
    ],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [FormsModule, NbButtonModule, NbIconModule, NbInputModule, NbListModule],
})
export class RecurrenceListItemComponent {
    @Input({ required: true })
    public expense: Expense;

    protected get frequencyLabel(): string {
        const frequency = this.expense.recurringFrequency ?? 'monthly';

        return frequency[0].toUpperCase() + frequency.slice(1);
    }

    protected toggleRecurring(): void {
        this.expense.recurring = !this.expense.recurring;

        if (this.expense.recurring) {
            this.expense.recurringFrequency ??= 'monthly';
            this.expense.recurringOccurrences ||= 12;
        }
    }
}
