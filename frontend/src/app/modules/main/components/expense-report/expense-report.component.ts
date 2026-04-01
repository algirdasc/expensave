import { Component, effect, inject, OnInit } from '@angular/core';
import { NbCardModule, NbDateService, NbIconModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { slideAnimation } from '../../../../animations/slide.animation';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { DateUtil } from '../../../../util/date.util';
import { DatePipe } from '@angular/common';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { ReportQueries } from '../../../../queries/report.queries';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { MainStore } from '../../main.store';
import { Calendar } from '../../../../api/objects/calendar';

@Component({
    selector: 'app-expense-report',
    templateUrl: 'expense-report.component.html',
    styleUrl: 'expense-report.component.scss',
    animations: slideAnimation,
    imports: [NbCardModule, NbIconModule, NbSpinnerModule, NbListModule, DatePipe, ShortNumberPipe],
})
export class ExpenseReportComponent implements OnInit {
    dateService = inject<NbDateService<Date>>(NbDateService);
    mainStore = inject(MainStore);
    reportsQueries = inject(ReportQueries);
    categoryExpenseQuery = injectQuery(() =>
        this.reportsQueries.categoryExpenses([this.selectedCalendar], this.dateFrom, this.dateTo)
    );

    dateFrom: Date;
    dateTo: Date;
    selectedCalendar: Calendar;
    categoryBalances: CategoryBalance[] = [];
    income: number = 0;
    expense: number = 0;
    change: number = 0;

    constructor() {
        effect(() => {
            const selectedMonth = this.mainStore.selectedMonth();
            this.dateFrom = DateUtil.firstDayOfMonth(selectedMonth);
            this.dateTo = DateUtil.lastDayOfMonth(selectedMonth);

            this.selectedCalendar = this.mainStore.selectedCalendar();
        });
    }

    public ngOnInit(): void {
        const response = this.categoryExpenseQuery.data();
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
