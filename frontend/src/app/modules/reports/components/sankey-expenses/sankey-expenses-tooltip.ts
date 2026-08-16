import { Chart, TooltipModel } from 'chart.js';
import { SankeyDataPoint } from 'chartjs-chart-sankey';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { getTooltipElement, positionTooltip } from '../chart-tooltip';

export const chartTooltipHandler = (context: { chart: Chart; tooltip: TooltipModel<'sankey'> }): void => {
    const { chart, tooltip } = context;

    const tooltipElement = getTooltipElement(tooltip, chart);
    if (tooltipElement === undefined) {
        return;
    }

    const dataPoint = tooltip.dataPoints[0].raw as SankeyDataPoint;

    const titleElement = tooltipElement.querySelector('.title');
    titleElement.innerHTML = `${dataPoint.from} &rarr; ${dataPoint.to}`;

    const rawElement = tooltipElement.querySelector('.raw');
    rawElement.innerHTML = new ShortNumberPipe().transform(dataPoint.flow);

    positionTooltip(tooltipElement, tooltip, chart);
};
