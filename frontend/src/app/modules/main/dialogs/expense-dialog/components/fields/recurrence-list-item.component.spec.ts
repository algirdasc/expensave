import { Expense } from '../../../../../../api/objects/expense';
import { RecurrenceListItemComponent } from './recurrence-list-item.component';

type RecurrenceListItemHarness = RecurrenceListItemComponent & {
    readonly frequencyLabel: string;
    toggleRecurring: () => void;
};

describe('RecurrenceListItemComponent', () => {
    let component: RecurrenceListItemHarness;

    beforeEach(() => {
        component = new RecurrenceListItemComponent() as RecurrenceListItemHarness;
        component.expense = new Expense();
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
});
