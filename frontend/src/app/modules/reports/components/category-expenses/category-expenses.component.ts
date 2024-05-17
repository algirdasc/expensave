import {Component, OnChanges} from '@angular/core';
import {ChartConfiguration} from 'chart.js';
import {finalize} from 'rxjs/operators';
import {ReportsApiService} from '../../../../api/reports.api.service';
import {CategoryExpenseReportResponse} from '../../../../api/response/category-expense-report.response';
import {ShortNumberPipe} from '../../../../pipes/shortnumber.pipe';
import {UNCATEGORIZED_COLOR} from '../../../../util/color.util';
import {AbstractReportComponent} from '../abstract-report.component';
import {chartTooltipHandler} from '../chart-tooltip';

@Component({
    selector: 'app-reports-category-expenses',
    templateUrl: 'category-expenses.component.html'
})
export class CategoryExpensesComponent extends AbstractReportComponent implements OnChanges {

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        indexAxis: 'y',
        scales: {
            x: {
                border: {
                    dash: [5],
                },
                ticks: {
                    callback: (value: string|number) => (new ShortNumberPipe()).transform(value)
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

    public barChartData: ChartConfiguration['data'] = {
        datasets: [],
    };

    public constructor(
        private readonly reportsApiService: ReportsApiService,
    ) {
        super();
    }

    public fetchReport(): void {
        this.isBusy = true;

        if (this.fetchSubscription) {
            this.fetchSubscription.unsubscribe();
            this.fetchSubscription = undefined;
        }

        this.fetchSubscription = this.reportsApiService
            .categoryExpenses(this.calendars, this.dateRange.start, this.dateRange.end)
            .pipe(
                finalize(() => this.isBusy = false)
            )
            .subscribe((response: CategoryExpenseReportResponse) => {
                const backgroundColors: string[] = [];
                const expenseLabels: string[] = [];
                const absoluteExpenseValues: number[] = [];

                for (const categoryBalance of response.categoryBalances) {
                    expenseLabels.push(categoryBalance.category?.name);
                    absoluteExpenseValues.push(Math.abs(categoryBalance.expense));
                    backgroundColors.push(categoryBalance.category?.color ?? UNCATEGORIZED_COLOR);
                }

                this.barChartData = {
                    labels: expenseLabels,
                    datasets: [
                        {
                            data: absoluteExpenseValues,
                            backgroundColor: backgroundColors,
                        }
                    ],
                }
            });
    }
}
