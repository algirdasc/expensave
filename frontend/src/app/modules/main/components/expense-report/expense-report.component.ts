import { Component, effect, inject } from '@angular/core';
import { NbCardModule, NbDateService, NbIconModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { slideAnimation } from '../../../../animations/slide.animation';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { DateUtil } from '../../../../util/date.util';
import { MainService } from '../../main.service';
import { DatePipe } from '@angular/common';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ReportsQueries } from '../../../../queries/reports.queries';

@Component({
    selector: 'app-expense-report',
    templateUrl: 'expense-report.component.html',
    styleUrl: 'expense-report.component.scss',
    animations: slideAnimation,
    imports: [NbCardModule, NbIconModule, NbSpinnerModule, NbListModule, DatePipe, ShortNumberPipe],
})
export class ExpenseReportComponent {
    public categoryBalances: CategoryBalance[] = [];
    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;

    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly mainService = inject(MainService);
    private readonly reportsQueries = inject(ReportsQueries);
    private readonly reportQuery = injectQuery(() => {
        const calendarId = this.mainService.calendar?.id;

        return {
            ...this.reportsQueries.categoryExpenses(calendarId ? [calendarId] : [], this.dateFrom, this.dateTo),
            enabled: !!calendarId,
        };
    });

    public constructor() {
        effect(() => {
            const response = this.reportQuery.data();
            if (response) {
                this.applyCategoryExpensesReport(response);
            } else {
                this.clearReport();
            }
        });
    }

    public get dateFrom(): Date {
        return this.dateService.createDate(
            this.mainService.visibleDate.getFullYear(),
            this.mainService.visibleDate.getMonth(),
            1
        );
    }

    public get dateTo(): Date {
        return DateUtil.endOfTheDay(
            this.dateService.createDate(
                this.mainService.visibleDate.getFullYear(),
                this.mainService.visibleDate.getMonth() + 1,
                0
            )
        );
    }

    public get isBusy(): boolean {
        return this.reportQuery.isFetching();
    }

    public createRange(number: number): number[] {
        // return new Array(number);
        return new Array(number).fill(0).map((n, index) => index + 1);
    }

    private applyCategoryExpensesReport(response: CategoryExpenseReportResponse): void {
        const balances = response.categoryBalances.filter(
            (categoryBalance: CategoryBalance) => categoryBalance.change !== 0
        );
        balances.sort((a: CategoryBalance, b: CategoryBalance) => {
            if (a.change > 0 && b.change < 0) {
                return -1;
            }

            return Math.abs(b.change) - Math.abs(a.change);
        });

        this.categoryBalances = balances;
        this.income = response.meta.income;
        this.expense = response.meta.expense;
        this.change = response.meta.change;
    }

    private clearReport(): void {
        this.categoryBalances = [];
        this.income = 0;
        this.expense = 0;
        this.change = 0;
    }
}
