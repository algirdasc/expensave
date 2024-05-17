import {FormatWidth, getLocaleDateFormat} from '@angular/common';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NbCalendarRange, NbDateService} from '@nebular/theme';
import {ChartConfiguration, ScriptableLineSegmentContext} from 'chart.js';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Calendar} from '../../../../api/objects/calendar';
import {ExpenseBalance} from '../../../../api/objects/expense-balance';
import {ReportsApiService} from '../../../../api/reports.api.service';
import {ExpenseReportResponse} from '../../../../api/response/expense-report.response';
import {APP_CONFIG} from '../../../../app.initializer';
import {ShortNumberPipe} from '../../../../pipes/shortnumber.pipe';
import {chartTooltipHandler} from './daily-expenses-tooltip';

@Component({
    selector: 'app-reports-daily-expenses',
    templateUrl: 'daily-expenses.component.html'
})
export class DailyExpensesComponent implements OnChanges {

    @Input({ required: true }) calendars: Calendar[];

    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;
    public isBusy: boolean = false;
    public dateRange: NbCalendarRange<Date>;

    private fetchSubscription: Subscription;

    public lineChartOptions: ChartConfiguration<'line', ExpenseBalance>['options'] = {
        responsive: true,
        parsing: {
            yAxisKey: 'balance',
            xAxisKey: 'balanceAt'
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
                display: false
            },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: chartTooltipHandler
            }
        },
    };

    public lineChartData: ChartConfiguration<'line', ExpenseBalance[]>['data'] = {
        datasets: [],
    };

    public constructor(
        private readonly dateService: NbDateService<Date>,
        private readonly reportsApiService: ReportsApiService,
    ) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.calendars && !changes?.calendars.isFirstChange()) {
            this.fetchReport();
        }
    }

    public onDateRangeChange(event: NbCalendarRange<Date>): void {
        this.dateRange = event;
        this.fetchReport();
    }

    private fetchReport(): void {
        this.isBusy = true;

        if (this.fetchSubscription) {
            this.fetchSubscription.unsubscribe();
            this.fetchSubscription = undefined;
        }

        this.fetchSubscription = this.reportsApiService
            .dailyExpenses(this.calendars, this.dateRange.start, this.dateRange.end)
            .pipe(
                finalize(() => this.isBusy = false)
            )
            .subscribe((response: ExpenseReportResponse) => {
                this.income = response.meta.income;
                this.change = response.meta.change;
                this.expense = Math.abs(response.meta.expense);

                const currentDate = new Date();

                const xAxisData: string[] = [];
                const balances: ExpenseBalance[] = [];

                for (const expenseBalance of response.expenseBalances) {
                    const date = this.dateService.format(expenseBalance.balanceAt, getLocaleDateFormat(APP_CONFIG.locale, FormatWidth.Short));

                    xAxisData.push(date);
                    balances.push(expenseBalance);
                }

                this.lineChartData = {
                    datasets: [
                        {
                            data: balances,
                            cubicInterpolationMode: 'monotone',
                            backgroundColor: 'rgba(47, 46, 95, .5)',
                            borderColor: '#2f2e5f',
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            fill: 'origin',
                            segment: {
                                borderDash: (ctx: ScriptableLineSegmentContext) => {
                                    if (balances[ctx.p0DataIndex].balanceAt > currentDate) {
                                        return [8, 8]
                                    }
                                },
                                borderColor: (ctx: ScriptableLineSegmentContext) => {
                                    if (balances[ctx.p0DataIndex].balanceAt > currentDate) {
                                        return '#59587f';
                                    }
                                },
                                backgroundColor: (ctx: ScriptableLineSegmentContext) => {
                                    if (balances[ctx.p0DataIndex].balanceAt > currentDate) {
                                        return 'rgba(89, 88, 127, .5)';
                                    }
                                }
                            }
                        }
                    ],
                    labels: xAxisData,
                }
            });
    }
}
