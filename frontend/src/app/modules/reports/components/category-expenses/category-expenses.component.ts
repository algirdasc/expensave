import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { NbCalendarRange, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { ChartConfiguration } from 'chart.js';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Calendar } from '../../../../api/objects/calendar';
import { ReportsApiService } from '../../../../api/reports.api.service';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';
import { PeriodEnum, PeriodSelectorComponent } from '../period-selector/period-selector.component';
import { chartTooltipHandler } from './category-expenses-tooltip';
import { DateRangeComponent } from '../date-range.component';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-reports-category-expenses',
    templateUrl: 'category-expenses.component.html',
    styleUrl: 'category-expenses.component.scss',
    imports: [
        NbCardModule,
        NbSpinnerModule,
        PeriodSelectorComponent,
        DateRangeComponent,
        BaseChartDirective,
        ShortNumberPipe,
    ],
})
export class CategoryExpensesComponent implements OnChanges {
    private readonly reportsApiService = inject(ReportsApiService);

    @Input({ required: true }) public calendars: Calendar[];

    public isBusy: boolean = false;
    public dateRange: NbCalendarRange<Date>;

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: {
                border: {
                    dash: [5],
                },
                ticks: {
                    callback: (value: string | number) => new ShortNumberPipe().transform(value),
                },
            },
            y: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
            },
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

    protected categoryCount: number = 0;
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
            .categoryExpenses(this.calendars, this.dateRange.start, this.dateRange.end)
            .pipe(finalize(() => (this.isBusy = false)))
            .subscribe((response: CategoryExpenseReportResponse) => this.parseReport(response));
    }

    private cleanUp(): void {
        this.barChartData = {
            datasets: [],
        };
    }

    private parseReport(response: CategoryExpenseReportResponse): void {
        const backgroundColors: string[] = [];
        const expenseLabels: string[] = [];
        const absoluteExpenseValues: number[] = [];

        for (const categoryBalance of response.categoryBalances) {
            expenseLabels.push(categoryBalance.category?.name);
            absoluteExpenseValues.push(Math.abs(categoryBalance.expense));
            backgroundColors.push(categoryBalance.category?.color ?? UNCATEGORIZED_COLOR);
        }

        this.categoryCount = response.categoryBalances.length;

        this.barChartData = {
            labels: expenseLabels,
            datasets: [
                {
                    data: absoluteExpenseValues,
                    backgroundColor: backgroundColors,
                    // maxBarThickness: 8,
                    // categoryPercentage: 0.5,
                },
            ],
        };
    }
}
