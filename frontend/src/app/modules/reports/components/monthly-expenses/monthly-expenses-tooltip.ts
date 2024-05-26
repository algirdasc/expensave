import { Chart, TooltipModel } from 'chart.js';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { getTooltipElement, positionTooltip } from '../chart-tooltip';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chartTooltipHandler = (context: { chart: Chart; tooltip: TooltipModel<any> }) => {
    const { chart, tooltip } = context;

    const tooltipElement = getTooltipElement(tooltip, chart);
    if (tooltipElement === undefined) {
        return;
    }

    const shortNumberPipe = new ShortNumberPipe();

    const income = tooltip.dataPoints[0].raw as number;
    const expense = tooltip.dataPoints[1].raw as number;

    const incomeElement = tooltipElement.querySelector('.income');
    incomeElement.innerHTML = shortNumberPipe.transform(income);

    const expenseElement = tooltipElement.querySelector('.expense');
    expenseElement.innerHTML = shortNumberPipe.transform(expense);

    const changeElement = tooltipElement.querySelector('.change');
    changeElement.innerHTML = shortNumberPipe.transform(income - expense);

    positionTooltip(tooltipElement, tooltip, chart);
};
