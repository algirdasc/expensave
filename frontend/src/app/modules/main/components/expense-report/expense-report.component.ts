import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { NbCardModule, NbDateService, NbIconModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { finalize } from 'rxjs/operators';
import { slideAnimation } from '../../../../animations/slide.animation';
import { Calendar } from '../../../../api/objects/calendar';
import { CategoryBalance } from '../../../../api/objects/category-balance';
import { ReportsApiService } from '../../../../api/reports.api.service';
import { CategoryExpenseReportResponse } from '../../../../api/response/category-expense-report.response';
import { DateUtil } from '../../../../util/date.util';
import { DatePipe } from '@angular/common';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';

@Component({
    selector: 'app-expense-report',
    templateUrl: 'expense-report.component.html',
    styleUrl: 'expense-report.component.scss',
    animations: slideAnimation,
    imports: [NbCardModule, NbIconModule, NbSpinnerModule, NbListModule, DatePipe, ShortNumberPipe],
})
export class ExpenseReportComponent implements OnInit, OnChanges {
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly reportsApiService = inject(ReportsApiService);

    @Input({ required: true }) public calendar: Calendar;
    @Input({ required: true }) public visibleDate: Date;

    public isBusy: boolean = true;
    public categoryBalances: CategoryBalance[] = [];
    public income: number = 0;
    public expense: number = 0;
    public change: number = 0;
    public dateFrom: Date;
    public dateTo: Date;

    public ngOnInit(): void {
        this.fetchReport();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes?.calendar && !changes.calendar.isFirstChange()) ||
            (changes?.visibleDate && !changes.visibleDate.isFirstChange())
        ) {
            this.fetchReport();
        }
    }

    public createRange(number: number): number[] {
        return new Array(number).fill(0).map((n, index) => index + 1);
    }

    private fetchReport(): void {
        this.isBusy = true;

        this.dateFrom = this.dateService.createDate(
            this.visibleDate.getFullYear(),
            this.visibleDate.getMonth(),
            1
        );
        this.dateTo = DateUtil.endOfTheDay(
            this.dateService.createDate(
                this.visibleDate.getFullYear(),
                this.visibleDate.getMonth() + 1,
                0
            )
        );

        this.reportsApiService
            .categoryExpenses([this.calendar], this.dateFrom, this.dateTo)
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
}
