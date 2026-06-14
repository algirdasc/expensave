import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
    income: number = 0;
    expense: number = 0;
    change: number = 0;
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
    barChartData: ChartConfiguration['data'] = {
        datasets: [],
    };
    readonly reportsApiMethod = 'monthlyExpenses' as const;

    get reportYear(): number | null {
        return this.currentReportPeriod?.start?.getFullYear() ?? null;
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

    cleanUp(): void {
        this.income = this.change = this.expense = 0;
        this.barChartData = {
            datasets: [],
        };
    }

    parseReport(response: ExpenseReportResponse): void {
        const xAxisData: string[] = [
            ...getLocaleMonthNames(APP_CONFIG.locale, FormStyle.Format, TranslationWidth.Short),
        ];
        const incomeData: number[] = [];
        const expenseData: number[] = [];

        for (const expenseBalance of response.expenseBalances) {
            this.income = response.meta.income;
            this.change = response.meta.change;
            this.expense = Math.abs(response.meta.expense);

            incomeData.push(expenseBalance.income);
            expenseData.push(Math.abs(expenseBalance.expense));
        }

        this.barChartData = {
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
            labels: xAxisData,
        };
    }
}
