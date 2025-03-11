import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import {
    NbCalendarRange,
    NbDateService,
    NbCardModule,
    NbSpinnerModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbIconModule,
} from '@nebular/theme';
import { ChartConfiguration } from 'chart.js';
import { ReportsApiService } from '../../../../api/reports.api.service';
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
export class MonthlyExpensesComponent extends AbstractReportComponent implements OnInit, OnChanges {
    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;

    public barChartOptions: ChartConfiguration['options'] = {
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

    public barChartData: ChartConfiguration['data'] = {
        datasets: [],
    };

    protected reportsApiMethod: string = 'monthlyExpenses';

    public ngOnInit(): void {
        this.navigateToday();
    }

    public navigatePrev(): void {
        this.navigateTo(this.dateService.addYear(this.dateRange.start, -1));
    }

    public navigateToday(): void {
        this.navigateTo(new Date());
    }

    public navigateNext(): void {
        this.navigateTo(this.dateService.addYear(this.dateRange.start, 1));
    }

    public navigateTo(date: Date): void {
        this.dateRange = <NbCalendarRange<Date>>{
            start: this.dateService.getYearStart(date),
            end: DateUtil.endOfTheDay(this.dateService.getYearEnd(date)),
        };

        this.fetchReport();
    }

    public constructor(
        protected readonly reportsApiService: ReportsApiService,
        private readonly dateService: NbDateService<Date>
    ) {
        super();
    }

    protected cleanUp(): void {
        this.income = this.change = this.expense = 0;
        this.barChartData = {
            datasets: [],
        };
    }

    protected parseReport(response: ExpenseReportResponse): void {
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
