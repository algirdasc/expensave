import {Chart, TooltipModel} from 'chart.js';
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

    const rawElement = tooltipElement.querySelector('.raw');
    rawElement.innerHTML = (new ShortNumberPipe()).transform(tooltip.dataPoints[0].raw as number);

    positionTooltip(tooltipElement, tooltip, chart);
};
