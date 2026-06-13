import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';
import { AbstractReportComponent } from '../abstract-report.component';
import { PeriodEnum, PeriodSelectorComponent } from '../period-selector/period-selector.component';
import { chartTooltipHandler } from './category-expenses-tooltip';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
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
export class CategoryExpensesComponent extends AbstractReportComponent {
    barChartOptions: ChartConfiguration['options'] = {
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

    barChartData: ChartConfiguration['data'] = {
        datasets: [],
    };

    categoryCount: number = 0;
    PeriodEnum = PeriodEnum;
    readonly reportsApiMethod = 'categoryExpenses' as const;

    get chartHeight(): string {
        return `${this.categoryCount * 28}px`;
    }

    cleanUp(): void {
        this.barChartData = {
            datasets: [],
        };
    }

    parseReport(response: CategoryExpenseReportResponse): void {
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
