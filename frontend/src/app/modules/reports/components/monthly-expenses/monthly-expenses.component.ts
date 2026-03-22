import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Calendar } from '../../../../api/objects/calendar';
import { ReportsApiService } from '../../../../api/reports.api.service';
import { ExpenseReportResponse } from '../../../../api/response/expense-report.response';
import { APP_CONFIG } from '../../../../app.initializer';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { DateUtil } from '../../../../util/date.util';
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
export class MonthlyExpensesComponent implements OnInit, OnChanges {
    private readonly reportsApiService = inject(ReportsApiService);
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);

    @Input({ required: true }) public calendars: Calendar[];

    public isBusy: boolean = false;
    public dateRange: NbCalendarRange<Date>;

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

    private fetchSubscription: Subscription;

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

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.calendars && !changes?.calendars.isFirstChange()) {
            this.fetchReport();
        }
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
            .monthlyExpenses(this.calendars, this.dateRange.start, this.dateRange.end)
            .pipe(finalize(() => (this.isBusy = false)))
            .subscribe((response: ExpenseReportResponse) => this.parseReport(response));
    }

    private cleanUp(): void {
        this.income = this.change = this.expense = 0;
        this.barChartData = {
            datasets: [],
        };
    }

    private parseReport(response: ExpenseReportResponse): void {
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
