import { Component, OnInit } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { finalize } from 'rxjs/operators';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { ReportsApiService } from '../../../../api/reports.api.service';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { DateUtil } from '../../../../util/date.util';
import { MainService } from '../../main.service';

@Component({
    selector: 'app-expense-report',
    templateUrl: 'expense-report.component.html',
    styleUrl: 'expense-report.component.scss',
})
export class ExpenseReportComponent implements OnInit {
    public isBusy: boolean = true;
    public categoryBalances: CategoryBalance[] = [];
    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;

    constructor(
        private dateService: NbDateService<Date>,
        private reportsApiService: ReportsApiService,
        private mainService: MainService
    ) {}

    public ngOnInit(): void {
        const currentDate = this.mainService.visibleDate;

        const dateFrom = this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const dateTo = DateUtil.endOfTheDay(
            this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        );

        this.reportsApiService
            .categoryExpenses([this.mainService.calendar], dateFrom, dateTo)
            .pipe(finalize(() => (this.isBusy = false)))
            .subscribe((response: CategoryExpenseReportResponse) => {
                const balances = response.categoryBalances.filter(
                    (categoryBalance: CategoryBalance) => categoryBalance.change !== 0
                );
                balances.sort((a: CategoryBalance, b: CategoryBalance) => Math.abs(b.change) - Math.abs(a.change));

                this.categoryBalances = balances;
                this.income = response.meta.income;
                this.expense = response.meta.expense;
                this.change = response.meta.change;
            });
    }

    public createRange(number: number): number[] {
        // return new Array(number);
        return new Array(number).fill(0).map((n, index) => index + 1);
    }
}
