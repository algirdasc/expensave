import { Component, inject, OnInit } from '@angular/core';
import { NbCardModule, NbDateService, NbIconModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { slideAnimation } from '../../../../animations/slide.animation';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { DateUtil } from '../../../../util/date.util';
import { MainService } from '../../main.service';
import { DatePipe } from '@angular/common';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ReportsQueries } from '../../../../queries/reports.queries';

@Component({
    selector: 'app-expense-report',
    templateUrl: 'expense-report.component.html',
    styleUrl: 'expense-report.component.scss',
    animations: slideAnimation,
    imports: [NbCardModule, NbIconModule, NbSpinnerModule, NbListModule, DatePipe, ShortNumberPipe],
})
export class ExpenseReportComponent implements OnInit {
    public isBusy: boolean = true;
    public categoryBalances: CategoryBalance[] = [];
    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;
    public dateFrom: Date;
    public dateTo: Date;

    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly mainService = inject(MainService);
    private readonly queryClient = inject(QueryClient);
    private readonly reportsQueries = inject(ReportsQueries);

    public ngOnInit(): void {
        const currentDate = this.mainService.visibleDate;

        this.dateFrom = this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth(), 1);
        this.dateTo = DateUtil.endOfTheDay(
            this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        );

        void this.queryClient
            .fetchQuery(
                this.reportsQueries.categoryExpenses([this.mainService.calendar.id], this.dateFrom, this.dateTo)
            )
            .then((response: CategoryExpenseReportResponse) => this.applyCategoryExpensesReport(response))
            .catch(() => undefined)
            .finally(() => (this.isBusy = false));
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
}
