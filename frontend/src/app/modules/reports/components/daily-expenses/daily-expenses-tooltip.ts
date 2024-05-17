import {Chart, TooltipModel} from 'chart.js';
import {ExpenseBalance} from '../../../../api/objects/expense-balance';
import {ShortNumberPipe} from '../../../../pipes/shortnumber.pipe';
import {getTooltipElement, positionTooltip} from '../chart-tooltip';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chartTooltipHandler = (context: {chart: Chart, tooltip: TooltipModel<any>}) => {
    const {chart, tooltip} = context;

    const tooltipElement = getTooltipElement(tooltip, chart);
    if (tooltipElement === undefined) {
        return;
    }

    const titleElement = tooltipElement.querySelector('.title');
    titleElement.innerHTML = tooltip.title[0];

    const expenseBalance = tooltip.dataPoints[0].raw as ExpenseBalance;
    const shortNumberPipe = new ShortNumberPipe();

    const balanceElement = tooltipElement.querySelector('.balance');
    balanceElement.innerHTML = shortNumberPipe.transform(expenseBalance.balance);

    const changeElement = tooltipElement.querySelector('.change');
    changeElement.innerHTML = shortNumberPipe.transform(expenseBalance.change);

    positionTooltip(tooltipElement, tooltip, chart);
};
