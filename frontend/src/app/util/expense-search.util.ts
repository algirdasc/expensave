import { Expense } from '../api/objects/expense';

const NUMERIC_QUERY_PATTERN = /^\d+([.,]\d+)?$/;

/**
 * Client-side expense search: matches against label, description and absolute amount.
 * An empty (or blank) query matches every expense.
 */
export function expenseMatchesSearch(expense: Expense, rawQuery: string): boolean {
    const query = rawQuery?.trim().toLowerCase() ?? '';

    if (!query) {
        return true;
    }

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
