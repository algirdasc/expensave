import { Component, computed, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbCardModule, NbSpinnerModule, NbThemeService } from '@nebular/theme';
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

    private readonly elementRef = inject(ElementRef);
    private readonly themeService = inject(NbThemeService);
    private readonly themeVersion = signal(0);

    private readonly sankeyChartDataValue = computed<ChartConfiguration<'sankey'>['data']>(() => {
        this.themeVersion();

        const response = this.reportData();
        if (!response) {
            return {
                datasets: [],
            };
        }

        const { data, colors, labels } = buildSankeyFlows(response.categoryBalances);

        return {
            datasets: [
                {
                    data,
                    labels,
                    colorFrom: (context): string =>
                        colors.get((context.raw as SankeyDataPoint).from) ?? UNCATEGORIZED_COLOR,
                    colorTo: (context): string =>
                        colors.get((context.raw as SankeyDataPoint).to) ?? UNCATEGORIZED_COLOR,
                    colorMode: 'gradient',
                    color: getComputedStyle(this.elementRef.nativeElement).color,
                    size: 'max',
                },
            ],
        };
    });

    constructor() {
        super();

        this.themeService
            .onThemeChange()
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.themeVersion.update(version => version + 1));
    }

    get sankeyChartData(): ChartConfiguration<'sankey'>['data'] {
        return this.sankeyChartDataValue();
    }
}
