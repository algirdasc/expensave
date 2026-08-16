import { Component, computed, inject } from '@angular/core';
import { NbCardModule, NbDateService, NbSpinnerModule } from '@nebular/theme';
import { ChartConfiguration } from 'chart.js';
import { ExpenseReportResponse } from '../../../../api/response/expense-report.response';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { AbstractReportComponent } from '../abstract-report.component';
import { DateRangeComponent } from '../date-range.component';
import { PeriodEnum, PeriodSelectorComponent } from '../period-selector/period-selector.component';
import { chartTooltipHandler } from './monthly-expenses-tooltip';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-reports-monthly-expenses',
    templateUrl: 'monthly-expenses.component.html',
    imports: [
        NbCardModule,
        NbSpinnerModule,
        PeriodSelectorComponent,
        DateRangeComponent,
        BaseChartDirective,
        ShortNumberPipe,
    ],
})
export class MonthlyExpensesComponent extends AbstractReportComponent<ExpenseReportResponse> {
    readonly dateService = inject<NbDateService<Date>>(NbDateService);
    barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            y: {
                border: {
                    dash: [5],
                },
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
    readonly reportsApiMethod = 'monthlyExpenses' as const;

    private readonly barChartDataValue = computed<ChartConfiguration['data']>(() => {
        const response = this.reportData();
        if (!response) {
            return {
                datasets: [],
            };
        }

        const period = this.reportPeriod();
        const showYear = !period?.start || period.start.getFullYear() !== period.end?.getFullYear();
        const labelFormat = showYear ? 'MMM yyyy' : 'MMM';

        const incomeData: number[] = [];
        const expenseData: number[] = [];
        const labels: string[] = [];

        for (const expenseBalance of response.expenseBalances) {
            labels.push(this.dateService.format(expenseBalance.balanceAt, labelFormat));
            incomeData.push(expenseBalance.income);
            expenseData.push(Math.abs(expenseBalance.expense));
        }

        return {
            datasets: [
                {
                    data: incomeData,
                    label: 'Income',
                    backgroundColor: '#00D68F',
                },
                {
                    data: expenseData,
                    label: 'Expense',
                    backgroundColor: '#FF3D71',
                },
            ],
            labels,
        };
    });
    private readonly reportMeta = computed(() => this.reportData()?.meta);

    get barChartData(): ChartConfiguration['data'] {
        return this.barChartDataValue();
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
