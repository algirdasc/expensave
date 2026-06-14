import { Expense } from '../../../../../../api/objects/expense';
import { RecurrenceListItemComponent } from './recurrence-list-item.component';

type RecurrenceListItemHarness = RecurrenceListItemComponent & {
    readonly isExistingRecurringExpense: boolean;
    readonly frequencyLabel: string;
    ngOnChanges: () => void;
    toggleRecurring: () => void;
};

describe('RecurrenceListItemComponent', () => {
    let component: RecurrenceListItemHarness;

    beforeEach(() => {
        component = new RecurrenceListItemComponent() as RecurrenceListItemHarness;
        component.expense = new Expense();
        component.ngOnChanges();
    });

    it('enables recurrence with sensible defaults', (): void => {
        component.expense.recurringFrequency = undefined as unknown as Expense['recurringFrequency'];
        component.expense.recurringOccurrences = undefined as unknown as number;

        component.toggleRecurring();

        expect(component.expense.recurring).toBeTrue();
        expect(component.expense.recurringFrequency).toBe('monthly');
        expect(component.expense.recurringOccurrences).toBe(12);
    });

    it('exposes a human readable frequency label', (): void => {
        component.expense.recurringFrequency = 'weekly';

        expect(component.frequencyLabel).toBe('Weekly');
    });

    it('falls back to monthly when a non-recurring API response has no frequency', (): void => {
        component.expense.recurringFrequency = null;

        expect(component.frequencyLabel).toBe('Monthly');
    });

    it('uses this occurrence as the default recurring update scope', (): void => {
        expect(component.expense.recurringUpdateScope).toBe('this');
    });

    it('uses edit-scope mode for expenses that were opened as recurring', (): void => {
        const expense = new Expense();
        expense.id = 10;
        expense.recurring = true;
        component.expense = expense;
        component.ngOnChanges();

        expect(component.isExistingRecurringExpense).toBeTrue();
    });

    it('uses recurrence controls when converting an existing one-off expense', (): void => {
        const expense = new Expense();
        expense.id = 10;
        expense.recurring = false;
        component.expense = expense;
        component.ngOnChanges();

        component.toggleRecurring();

        expect(component.expense.recurring).toBeTrue();
        expect(component.isExistingRecurringExpense).toBeFalse();
    });
});
