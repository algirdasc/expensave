import { Component, computed, inject } from '@angular/core';
import { NbCardModule, NbDateService, NbIconModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { slideAnimation } from '../../../../animations/slide.animation';
import { CategoryBalance } from '../../../../api/objects/category-balance';
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
    private readonly reportData = computed(() => this.reportQuery.data());
    private readonly categoryBalancesValue = computed(() => {
        const balances =
            this.reportData()?.categoryBalances.filter(
                (categoryBalance: CategoryBalance) => categoryBalance.change !== 0
            ) ?? [];

        return [...balances].sort((a: CategoryBalance, b: CategoryBalance) => {
            if (a.change > 0 && b.change < 0) {
                return -1;
            }

            return Math.abs(b.change) - Math.abs(a.change);
        });
    });

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

    public get categoryBalances(): CategoryBalance[] {
        return this.categoryBalancesValue();
    }

    public get income(): number {
        return this.reportData()?.meta.income ?? 0;
    }

    public get expense(): number {
        return this.reportData()?.meta.expense ?? 0;
    }

    public get change(): number {
        return this.reportData()?.meta.change ?? 0;
    }
}
