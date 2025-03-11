import { Component, OnChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ReportsApiService } from '../../../../api/reports.api.service';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';
import { AbstractReportComponent } from '../abstract-report.component';
import { PeriodEnum } from '../period-selector/period-selector.component';
import { chartTooltipHandler } from './category-expenses-tooltip';

@Component({
    selector: 'app-reports-category-expenses',
    templateUrl: 'category-expenses.component.html',
    styleUrl: 'category-expenses.component.scss',
    standalone: false
})
export class CategoryExpensesComponent extends AbstractReportComponent implements OnChanges {
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
    protected reportsApiMethod: string = 'categoryExpenses';

    public constructor(protected readonly reportsApiService: ReportsApiService) {
        super();
    }

    protected cleanUp(): void {
        this.barChartData = {
            datasets: [],
        };
    }

    protected parseReport(response: CategoryExpenseReportResponse): void {
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
