import { Component, OnInit, inject } from '@angular/core';
import { NbDateService, NbCardModule, NbIconModule, NbSpinnerModule, NbListModule } from '@nebular/theme';
import { finalize } from 'rxjs/operators';
import { slideAnimation } from '../../../../animations/slide.animation';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { ReportsApiService } from '../../../../api/reports.api.service';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { DateUtil } from '../../../../util/date.util';
import { MainService } from '../../main.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';

@Component({
    selector: 'app-expense-report',
    templateUrl: 'expense-report.component.html',
    styleUrl: 'expense-report.component.scss',
    animations: slideAnimation,
    imports: [NbCardModule, NbIconModule, NgIf, NbSpinnerModule, NbListModule, NgFor, DatePipe, ShortNumberPipe],
})
export class ExpenseReportComponent implements OnInit {
    private dateService = inject<NbDateService<Date>>(NbDateService);
    private reportsApiService = inject(ReportsApiService);
    private mainService = inject(MainService);

    public isBusy: boolean = true;
    public categoryBalances: CategoryBalance[] = [];
    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;
    public dateFrom: Date;
    public dateTo: Date;

    public ngOnInit(): void {
        const currentDate = this.mainService.visibleDate;

        this.dateFrom = this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth(), 1);
        this.dateTo = DateUtil.endOfTheDay(
            this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        );

        this.reportsApiService
            .categoryExpenses([this.mainService.calendar], this.dateFrom, this.dateTo)
            .pipe(finalize(() => (this.isBusy = false)))
            .subscribe((response: CategoryExpenseReportResponse) => {
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
            });
    }

    public createRange(number: number): number[] {
        // return new Array(number);
        return new Array(number).fill(0).map((n, index) => index + 1);
    }
}
