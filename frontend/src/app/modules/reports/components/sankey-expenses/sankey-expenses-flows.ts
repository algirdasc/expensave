import { SankeyDataPoint } from 'chartjs-chart-sankey';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';

export const BUDGET_NODE = 'Budget';
export const SAVED_NODE = 'Saved';
export const BUDGET_COLOR = '#00D68F';
export const SAVED_COLOR = '#0095ff';
export const UNCATEGORIZED_NAME = 'Uncategorized';

export type SankeyFlows = {
    data: SankeyDataPoint[];
    colors: Map<string, string>;
    labels: Record<string, string>;
    columns: Record<string, number>;
};

export function buildSankeyFlows(categoryBalances: CategoryBalance[]): SankeyFlows {
    const data: SankeyDataPoint[] = [];
    const colors = new Map<string, string>([
        [BUDGET_NODE, BUDGET_COLOR],
        [SAVED_NODE, SAVED_COLOR],
    ]);
    const labels: Record<string, string> = {};

    let totalIncome = 0;
    let totalExpense = 0;

    for (const categoryBalance of categoryBalances) {
        const name = categoryBalance.category?.name ?? UNCATEGORIZED_NAME;
        const expense = Math.abs(categoryBalance.expense);
        colors.set(name, categoryBalance.category?.color ?? UNCATEGORIZED_COLOR);
        labels[name] = withSum(name, Math.max(categoryBalance.income, expense));

        if (categoryBalance.income > 0) {
            data.push({ from: name, to: BUDGET_NODE, flow: categoryBalance.income });
            totalIncome += categoryBalance.income;
        }

        if (expense !== 0) {
            data.push({ from: BUDGET_NODE, to: name, flow: expense });
            totalExpense += expense;
        }
    }

    const change = totalIncome - totalExpense;
    labels[BUDGET_NODE] = withSum(BUDGET_NODE, change);

    const columns: Record<string, number> = {};

    if (change > 0) {
        data.push({ from: BUDGET_NODE, to: SAVED_NODE, flow: change });
        labels[SAVED_NODE] = withSum(SAVED_NODE, change);

        const expenseColumn = totalIncome > 0 ? 2 : 1;
        columns[SAVED_NODE] = expenseColumn + 1;
    }

    return { data, colors, labels, columns };
}

function withSum(name: string, sum: number): string {
    return `${name} (${new ShortNumberPipe().transform(sum)})`;
}
