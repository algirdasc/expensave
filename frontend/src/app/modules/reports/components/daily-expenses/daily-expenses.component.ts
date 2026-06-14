import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NbCardModule, NbDateService, NbSpinnerModule } from '@nebular/theme';
import { ChartConfiguration, ScriptableLineSegmentContext } from 'chart.js';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { ExpenseReportResponse } from '../../../../api/response/expense-report.response';
import { APP_CONFIG } from '../../../../app.initializer';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { AbstractReportComponent } from '../abstract-report.component';
import { PeriodEnum, PeriodSelectorComponent } from '../period-selector/period-selector.component';
import { chartTooltipHandler } from './daily-expenses-tooltip';
import { DateRangeComponent } from '../date-range.component';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-reports-daily-expenses',
    templateUrl: 'daily-expenses.component.html',
    imports: [
        NbCardModule,
        NbSpinnerModule,
        PeriodSelectorComponent,
        DateRangeComponent,
        BaseChartDirective,
        ShortNumberPipe,
    ],
})
export class DailyExpensesComponent extends AbstractReportComponent<ExpenseReportResponse> {
    dateService = inject<NbDateService<Date>>(NbDateService);
    lineChartOptions: ChartConfiguration<'line', ExpenseBalance>['options'] = {
        responsive: true,
        parsing: {
            yAxisKey: 'balance',
            xAxisKey: 'balanceAt',
        },
        scales: {
            x: {
                type: 'category',
            },
            y: {
                position: 'left',
                border: {
                    dash: [5],
                },
                beginAtZero: true,
                ticks: {
                    callback: (value: string | number) => new ShortNumberPipe().transform(value),
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: chartTooltipHandler,
            },
        },
    };
    PeriodEnum = PeriodEnum;
    readonly reportsApiMethod = 'dailyExpenses' as const;

    private readonly lineChartDataValue = computed<ChartConfiguration<'line', ExpenseBalance[]>['data']>(() => {
        const response = this.reportData();
        if (!response) {
            return {
                datasets: [],
            };
        }

        const currentDate = new Date();
        const xAxisData: string[] = [];
        const balances: ExpenseBalance[] = [];

        for (const expenseBalance of response.expenseBalances) {
            const date = this.dateService.format(
                expenseBalance.balanceAt,
                getLocaleDateFormat(APP_CONFIG.locale, FormatWidth.Short)
            );

            xAxisData.push(date);
            balances.push(expenseBalance);
        }

        return {
            datasets: [
                {
                    data: balances,
                    cubicInterpolationMode: 'monotone',
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    fill: 'origin',
                    segment: {
                        borderDash: (ctx: ScriptableLineSegmentContext): number[] => {
                            if (balances[ctx.p0DataIndex].balanceAt > currentDate) {
                                return [8, 8];
                            }
                        },
                    },
                },
            ],
            labels: xAxisData,
        };
    });
    private readonly reportMeta = computed(() => this.reportData()?.meta);

    get lineChartData(): ChartConfiguration<'line', ExpenseBalance[]>['data'] {
        return this.lineChartDataValue();
    }

    get income(): number {
        return this.reportMeta()?.income ?? 0;
    }

    get change(): number {
        return this.reportMeta()?.change ?? 0;
    }

    get expense(): number {
        return Math.abs(this.reportMeta()?.expense ?? 0);
    }
}
