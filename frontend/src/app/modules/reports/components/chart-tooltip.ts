import { Chart, TooltipModel } from 'chart.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const positionTooltip = (tooltipElement: HTMLDivElement, tooltip: TooltipModel<any>, chart: Chart) => {
    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    tooltipElement.style.left = positionX + tooltip.caretX - tooltipElement.clientWidth / 2 + 'px';
    tooltipElement.style.top = positionY + tooltip.caretY - tooltipElement.clientHeight - 16 + 'px';
    tooltipElement.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTooltipElement = (tooltip: TooltipModel<any>, chart: Chart) => {
    const tooltipElement: HTMLDivElement = chart.canvas.parentNode.querySelector('div.chart-tooltip');

    if (tooltip.opacity === 0) {
        return;
    }

    return tooltipElement;
};
