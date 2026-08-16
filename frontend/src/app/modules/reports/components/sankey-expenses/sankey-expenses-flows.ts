import { SankeyDataPoint } from 'chartjs-chart-sankey';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';

export const INCOME_NODE = 'Income';
export const SAVED_NODE = 'Saved';
export const INCOME_COLOR = '#00D68F';
export const SAVED_COLOR = '#0095ff';
export const UNCATEGORIZED_NAME = 'Uncategorized';

export type SankeyFlows = {
    data: SankeyDataPoint[];
    colors: Map<string, string>;
};

export function buildSankeyFlows(categoryBalances: CategoryBalance[]): SankeyFlows {
    const data: SankeyDataPoint[] = [];
    const colors = new Map<string, string>([
        [INCOME_NODE, INCOME_COLOR],
        [SAVED_NODE, SAVED_COLOR],
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    for (const categoryBalance of categoryBalances) {
        const name = categoryBalance.category?.name ?? UNCATEGORIZED_NAME;
        colors.set(name, categoryBalance.category?.color ?? UNCATEGORIZED_COLOR);

        if (categoryBalance.income > 0) {
            data.push({ from: name, to: INCOME_NODE, flow: categoryBalance.income });
            totalIncome += categoryBalance.income;
        }

        if (categoryBalance.expense !== 0) {
            const flow = Math.abs(categoryBalance.expense);
            data.push({ from: INCOME_NODE, to: name, flow });
            totalExpense += flow;
        }
    }

    if (totalIncome > totalExpense) {
        data.push({ from: INCOME_NODE, to: SAVED_NODE, flow: totalIncome - totalExpense });
    }

    return { data, colors };
}
