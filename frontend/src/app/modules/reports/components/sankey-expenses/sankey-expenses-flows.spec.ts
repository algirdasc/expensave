import { CategoryBalance } from '../../../../api/objects/category-balance';
import { Category } from '../../../../api/objects/category';
import { APP_CONFIG } from '../../../../app.initializer';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';
import {
    BUDGET_COLOR,
    BUDGET_NODE,
    buildSankeyFlows,
    SAVED_COLOR,
    SAVED_NODE,
    UNCATEGORIZED_NAME,
} from './sankey-expenses-flows';

function categoryBalance(name: string | null, color: string | null, income: number, expense: number): CategoryBalance {
    return {
        category: name === null ? null : ({ name, color } as Category),
        income,
        expense,
    } as CategoryBalance;
}

describe('buildSankeyFlows', () => {
    beforeAll(() => {
        APP_CONFIG.locale = 'en-US';
    });

    it('routes income through the budget node to expense categories and saves the remainder', () => {
        const { data, colors } = buildSankeyFlows([
            categoryBalance('Salary', '#111111', 2000, 0),
            categoryBalance('Groceries', '#222222', 0, -500),
            categoryBalance('Rent', '#333333', 0, -700),
        ]);

        expect(data).toEqual([
            { from: 'Salary', to: BUDGET_NODE, flow: 2000 },
            { from: BUDGET_NODE, to: 'Groceries', flow: 500 },
            { from: BUDGET_NODE, to: 'Rent', flow: 700 },
            { from: BUDGET_NODE, to: SAVED_NODE, flow: 800 },
        ]);
        expect(colors.get('Salary')).toBe('#111111');
        expect(colors.get(BUDGET_NODE)).toBe(BUDGET_COLOR);
        expect(colors.get(SAVED_NODE)).toBe(SAVED_COLOR);
    });

    it('labels nodes with their sums', () => {
        const { labels } = buildSankeyFlows([
            categoryBalance('Salary', '#111111', 2000, 0),
            categoryBalance('Rent', '#333333', 0, -700),
        ]);

        expect(labels['Salary']).toBe('Salary (2.00K)');
        expect(labels['Rent']).toBe('Rent (700.00)');
        expect(labels[BUDGET_NODE]).toBe('Budget (1.30K)');
        expect(labels[SAVED_NODE]).toBe('Saved (1.30K)');
    });

    it('omits the saved node when expenses exceed income', () => {
        const { data, labels } = buildSankeyFlows([
            categoryBalance('Salary', '#111111', 1000, 0),
            categoryBalance('Rent', '#333333', 0, -1500),
        ]);

        expect(data).toEqual([
            { from: 'Salary', to: BUDGET_NODE, flow: 1000 },
            { from: BUDGET_NODE, to: 'Rent', flow: 1500 },
        ]);
        expect(labels[SAVED_NODE]).toBeUndefined();
    });

    it('falls back to uncategorized name and color for missing categories', () => {
        const { data, colors } = buildSankeyFlows([categoryBalance(null, null, 0, -42)]);

        expect(data).toEqual([{ from: BUDGET_NODE, to: UNCATEGORIZED_NAME, flow: 42 }]);
        expect(colors.get(UNCATEGORIZED_NAME)).toBe(UNCATEGORIZED_COLOR);
    });

    it('returns no flows for empty balances', () => {
        expect(buildSankeyFlows([]).data).toEqual([]);
    });
});
