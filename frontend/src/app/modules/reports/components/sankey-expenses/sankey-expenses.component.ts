import { Component, computed } from '@angular/core';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { Chart, ChartConfiguration } from 'chart.js';
import { Flow, SankeyController, SankeyDataPoint } from 'chartjs-chart-sankey';
import { BaseChartDirective } from 'ng2-charts';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';
import { AbstractReportComponent } from '../abstract-report.component';
import { DateRangeComponent } from '../date-range.component';
import { PeriodEnum, PeriodSelectorComponent } from '../period-selector/period-selector.component';
import { buildSankeyFlows } from './sankey-expenses-flows';
import { chartTooltipHandler } from './sankey-expenses-tooltip';

Chart.register(SankeyController, Flow);

@Component({
    selector: 'app-reports-sankey-expenses',
    templateUrl: 'sankey-expenses.component.html',
    styleUrl: 'sankey-expenses.component.scss',
    imports: [
        NbCardModule,
        NbSpinnerModule,
        PeriodSelectorComponent,
        DateRangeComponent,
        BaseChartDirective,
        ShortNumberPipe,
    ],
})
export class SankeyExpensesComponent extends AbstractReportComponent<CategoryExpenseReportResponse> {
    readonly sankeyChartOptions: ChartConfiguration<'sankey'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: false,
                external: chartTooltipHandler,
            },
        },
    };
    readonly reportsApiMethod = 'categoryExpenses' as const;
    protected readonly PeriodEnum = PeriodEnum;

    private readonly sankeyChartDataValue = computed<ChartConfiguration<'sankey'>['data']>(() => {
        const response = this.reportData();
        if (!response) {
            return {
                datasets: [],
            };
        }

        const { data, colors } = buildSankeyFlows(response.categoryBalances);

        return {
            datasets: [
                {
                    data,
                    colorFrom: (context): string =>
                        colors.get((context.raw as SankeyDataPoint).from) ?? UNCATEGORIZED_COLOR,
                    colorTo: (context): string =>
                        colors.get((context.raw as SankeyDataPoint).to) ?? UNCATEGORIZED_COLOR,
                    colorMode: 'gradient',
                    size: 'max',
                },
            ],
        };
    });

    get sankeyChartData(): ChartConfiguration<'sankey'>['data'] {
        return this.sankeyChartDataValue();
    }
}
