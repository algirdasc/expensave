import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
import { NbDateService, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { ChartConfiguration, ScriptableLineSegmentContext } from 'chart.js';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { ReportsApiService } from '../../../../api/reports.api.service';
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
export class DailyExpensesComponent extends AbstractReportComponent implements OnChanges {
    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;

    public lineChartOptions: ChartConfiguration<'line', ExpenseBalance>['options'] = {
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

    public lineChartData: ChartConfiguration<'line', ExpenseBalance[]>['data'] = {
        datasets: [],
    };

    protected PeriodEnum = PeriodEnum;
    protected reportsApiMethod: string = 'dailyExpenses';

    public constructor(
        private readonly dateService: NbDateService<Date>,
        protected readonly reportsApiService: ReportsApiService
    ) {
        super();
    }

    protected cleanUp(): void {
        this.income = this.change = this.expense = 0;
        this.lineChartData = {
            datasets: [],
        };
    }

    protected parseReport(response: ExpenseReportResponse): void {
        this.income = response.meta.income;
        this.change = response.meta.change;
        this.expense = Math.abs(response.meta.expense);

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

        this.lineChartData = {
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
    }
}
