import { Expense } from '../api/objects/expense';
import { expenseMatchesSearch, hasExpenseSearchQuery } from './expense-search.util';

function createExpense(data: Partial<Expense>): Expense {
    return Object.assign(new Expense(), data);
}

describe('expenseMatchesSearch', () => {
    it('matches every expense when the query is empty or blank', (): void => {
        const expense = createExpense({ label: 'Groceries', amount: -12.5 });

        expect(expenseMatchesSearch(expense, '')).toBeTrue();
        expect(expenseMatchesSearch(expense, '   ')).toBeTrue();
        expect(expenseMatchesSearch(expense, null)).toBeTrue();
        expect(expenseMatchesSearch(expense, undefined)).toBeTrue();
    });

    it('matches by label case-insensitively', (): void => {
        const expense = createExpense({ label: 'Weekly Groceries', amount: -12.5 });

        expect(expenseMatchesSearch(expense, 'groceries')).toBeTrue();
        expect(expenseMatchesSearch(expense, 'GROCERIES')).toBeTrue();
        expect(expenseMatchesSearch(expense, 'fuel')).toBeFalse();
    });

    it('matches by description case-insensitively', (): void => {
        const expense = createExpense({ label: 'Groceries', description: 'Bought at IKI store', amount: -12.5 });

        expect(expenseMatchesSearch(expense, 'iki')).toBeTrue();
        expect(expenseMatchesSearch(expense, 'store')).toBeTrue();
        expect(expenseMatchesSearch(expense, 'maxima')).toBeFalse();
    });

    it('matches by absolute amount with dot or comma decimal separator', (): void => {
        const expense = createExpense({ label: 'Groceries', amount: -12.5 });

        expect(expenseMatchesSearch(expense, '12.5')).toBeTrue();
        expect(expenseMatchesSearch(expense, '12,5')).toBeTrue();
        expect(expenseMatchesSearch(expense, '12.50')).toBeTrue();
        expect(expenseMatchesSearch(expense, '12.51')).toBeFalse();
    });

    it('matches income amounts the same way as expense amounts', (): void => {
        const income = createExpense({ label: 'Salary', amount: 1500 });

        expect(expenseMatchesSearch(income, '1500')).toBeTrue();
        expect(expenseMatchesSearch(income, '1500.00')).toBeTrue();
        expect(expenseMatchesSearch(income, '150')).toBeTrue();
        expect(expenseMatchesSearch(income, '1600')).toBeFalse();
    });

    it('does not match amounts for non-numeric queries', (): void => {
        const expense = createExpense({ label: 'Groceries', amount: -12.5 });

        expect(expenseMatchesSearch(expense, 'groceries 12.5')).toBeFalse();
        expect(expenseMatchesSearch(expense, '-12.5')).toBeFalse();
    });

    it('ignores surrounding whitespace in the query', (): void => {
        const expense = createExpense({ label: 'Groceries', amount: -12.5 });

        expect(expenseMatchesSearch(expense, '  groceries  ')).toBeTrue();
    });

    it('handles missing label, description and amount', (): void => {
        const expense = createExpense({});

        expect(expenseMatchesSearch(expense, 'anything')).toBeFalse();
        expect(expenseMatchesSearch(expense, '')).toBeTrue();
    });
});

describe('hasExpenseSearchQuery', () => {
    it('is false for empty, blank or nullish queries', (): void => {
        expect(hasExpenseSearchQuery('')).toBeFalse();
        expect(hasExpenseSearchQuery('   ')).toBeFalse();
        expect(hasExpenseSearchQuery(null)).toBeFalse();
        expect(hasExpenseSearchQuery(undefined)).toBeFalse();
    });

    it('is true for a query with content', (): void => {
        expect(hasExpenseSearchQuery('groceries')).toBeTrue();
        expect(hasExpenseSearchQuery(' 12.5 ')).toBeTrue();
    });
});
