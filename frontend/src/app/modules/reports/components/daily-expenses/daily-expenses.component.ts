import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { NbCalendarRange, NbDateService, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { ChartConfiguration, ScriptableLineSegmentContext } from 'chart.js';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Calendar } from '../../../../api/objects/calendar';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { ReportsApiService } from '../../../../api/reports.api.service';
import { ExpenseReportResponse } from '../../../../api/response/expense-report.response';
import { APP_CONFIG } from '../../../../app.initializer';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
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
export class DailyExpensesComponent implements OnChanges {
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly reportsApiService = inject(ReportsApiService);

    @Input({ required: true }) public calendars: Calendar[];

    public isBusy: boolean = false;
    public dateRange: NbCalendarRange<Date>;

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

    private fetchSubscription: Subscription;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.calendars && !changes?.calendars.isFirstChange()) {
            this.fetchReport();
        }
    }

    public onDateRangeChange(event: NbCalendarRange<Date>): void {
        this.dateRange = event;
        this.fetchReport();
    }

    private preparedToFetch(): boolean {
        if (!this.calendars.length) {
            this.cleanUp();
            return false;
        }

        this.isBusy = true;

        if (this.fetchSubscription) {
            this.fetchSubscription.unsubscribe();
            this.fetchSubscription = undefined;
        }

        return true;
    }

    private fetchReport(): void {
        if (!this.preparedToFetch()) {
            return;
        }

        this.fetchSubscription = this.reportsApiService
            .dailyExpenses(this.calendars, this.dateRange.start, this.dateRange.end)
            .pipe(finalize(() => (this.isBusy = false)))
            .subscribe((response: ExpenseReportResponse) => this.parseReport(response));
    }

    private cleanUp(): void {
        this.income = this.change = this.expense = 0;
        this.lineChartData = {
            datasets: [],
        };
    }

    private parseReport(response: ExpenseReportResponse): void {
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
