import {FormStyle, getLocaleMonthNames, TranslationWidth} from '@angular/common';
import {Component, OnChanges, OnInit} from '@angular/core';
import {NbCalendarRange, NbDateService} from '@nebular/theme';
import {ChartConfiguration} from 'chart.js';
import {ReportsApiService} from '../../../../api/reports.api.service';
import {ExpenseReportResponse} from '../../../../api/response/expense-report.response';
import {APP_CONFIG} from '../../../../app.initializer';
import {ShortNumberPipe} from '../../../../pipes/shortnumber.pipe';
import {DateUtil} from '../../../../util/date.util';
import {AbstractReportComponent} from '../abstract-report.component';
import {chartTooltipHandler} from '../chart-tooltip';

@Component({
    selector: 'app-reports-monthly-expenses',
    templateUrl: 'monthly-expenses.component.html'
})
export class MonthlyExpensesComponent extends AbstractReportComponent implements OnInit, OnChanges {

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            y: {
                border: {
                    dash: [5],
                },
                ticks: {
                    callback: (value: string|number) => (new ShortNumberPipe()).transform(value)
                }
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
        this.dateRange = <NbCalendarRange<Date>> {
            start: this.dateService.getYearStart(date),
            end: DateUtil.endOfTheDay(this.dateService.getYearEnd(date)),
        };

        console.log('navigating to', date, this.dateRange);

        this.fetchReport();
    }

    public constructor(
        private readonly reportsApiService: ReportsApiService,
        private readonly dateService: NbDateService<Date>,
    ) {
        super();
        this.reportsApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public fetchReport(): void {
        if (this.fetchSubscription) {
            this.fetchSubscription.unsubscribe();
            this.fetchSubscription = undefined;
        }

        this.fetchSubscription = this.reportsApiService
            .monthlyExpenses(this.calendars, this.dateRange.start, this.dateRange.end)
            .subscribe((response: ExpenseReportResponse) => {
                const xAxisData: string[] = [...getLocaleMonthNames(APP_CONFIG.locale, FormStyle.Format, TranslationWidth.Short)];
                const incomeData: number[] = [];
                const expenseData: number[] = [];

                for (const expenseBalance of response.expenseBalances) {
                    incomeData.push(expenseBalance.income);
                    expenseData.push(Math.abs(expenseBalance.expense));
                }

                this.barChartData = {
                    datasets: [
                        {
                            data: incomeData,
                            label: 'Income',
                            backgroundColor: 'rgba(0, 214, 143, .5)',
                        },
                        {
                            data: expenseData,
                            label: 'Expense',
                            backgroundColor: 'rgba(255, 61, 113, .5)',
                        }
                    ],
                    labels: xAxisData,
                }
            });
    }
}
