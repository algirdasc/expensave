import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import {
    NbButtonGroupModule,
    NbButtonModule,
    NbCalendarRange,
    NbCardModule,
    NbDateService,
    NbIconModule,
    NbSpinnerModule,
} from '@nebular/theme';
import { ChartConfiguration } from 'chart.js';
import { ExpenseReportResponse } from '../../../../api/response/expense-report.response';
import { APP_CONFIG } from '../../../../app.initializer';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { DateUtil } from '../../../../util/date.util';
import { AbstractReportComponent } from '../abstract-report.component';
import { chartTooltipHandler } from './monthly-expenses-tooltip';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-reports-monthly-expenses',
    templateUrl: 'monthly-expenses.component.html',
    imports: [
        NbCardModule,
        NbSpinnerModule,
        NbButtonGroupModule,
        NbButtonModule,
        NbIconModule,
        BaseChartDirective,
        ShortNumberPipe,
    ],
})
export class MonthlyExpensesComponent extends AbstractReportComponent<ExpenseReportResponse> implements OnInit {
    readonly dateService = inject<NbDateService<Date>>(NbDateService);
    readonly monthLabels: string[] = [
        ...getLocaleMonthNames(APP_CONFIG.locale, FormStyle.Format, TranslationWidth.Short),
    ];
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
    readonly reportsApiMethod = 'monthlyExpenses' as const;

    private readonly barChartDataValue = computed<ChartConfiguration['data']>(() => {
        const response = this.reportData();
        if (!response) {
            return {
                datasets: [],
            };
        }

        const incomeData: number[] = [];
        const expenseData: number[] = [];

        for (const expenseBalance of response.expenseBalances) {
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
            labels: this.monthLabels,
        };
    });
    private readonly reportMeta = computed(() => this.reportData()?.meta);

    get reportYear(): number | null {
        return this.currentReportPeriod?.start?.getFullYear() ?? null;
    }

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

    ngOnInit(): void {
        this.navigateToday();
    }

    navigatePrev(): void {
        this.navigateTo(this.dateService.addYear(this.reportPeriod()?.start, -1));
    }

    navigateToday(): void {
        this.navigateTo(new Date());
    }

    navigateNext(): void {
        this.navigateTo(this.dateService.addYear(this.reportPeriod()?.start, 1));
    }

    navigateTo(date: Date): void {
        this.reportPeriod.set(<NbCalendarRange<Date>>{
            start: this.dateService.getYearStart(date),
            end: DateUtil.endOfTheDay(this.dateService.getYearEnd(date)),
        });
    }
}
