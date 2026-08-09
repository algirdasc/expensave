import { Expense } from '../api/objects/expense';

const NUMERIC_QUERY_PATTERN = /^\d+([.,]\d+)?$/;

/**
 * Tells whether a raw search query contains anything worth filtering by.
 */
export function hasExpenseSearchQuery(rawQuery: string): boolean {
    return !!rawQuery?.trim();
}

/**
 * Client-side expense search: matches against label, description and absolute amount.
 * An empty (or blank) query matches every expense.
 */
export function expenseMatchesSearch(expense: Expense, rawQuery: string): boolean {
    if (!hasExpenseSearchQuery(rawQuery)) {
        return true;
    }

    const query = rawQuery.trim().toLowerCase();

    if (expense.label?.toLowerCase().includes(query)) {
        return true;
    }

    if (expense.description?.toLowerCase().includes(query)) {
        return true;
    }

    return NUMERIC_QUERY_PATTERN.test(query) && expenseMatchesAmount(expense, query);
}

function expenseMatchesAmount(expense: Expense, query: string): boolean {
    if (expense.amount === null || expense.amount === undefined) {
        return false;
    }

    const normalizedQuery = query.replace(',', '.');
    const absoluteAmount = Math.abs(expense.amount);

    return [absoluteAmount.toString(), absoluteAmount.toFixed(2)].some((formatted: string) =>
        formatted.includes(normalizedQuery)
    );
}
