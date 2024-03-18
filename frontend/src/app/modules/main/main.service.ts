import {ChangeDetectorRef, Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Calendar} from '../../api/entities/calendar.entity';
import {Expense} from '../../api/entities/expense.entity';
import {User} from '../../api/entities/user.entity';
import {ExpenseApiService} from '../../api/expense.api.service';
import {DateRangeChangeEvent} from './calendar/events/date-range-change.event';

@Injectable()
export class MainService {
    public user: User;
    public selectedDate: Date;
    public calendar: Calendar;
    public dateRange: DateRangeChangeEvent;
    public expenses: Expense[] = [];

    constructor(
        private readonly expenseApiService: ExpenseApiService,
    ) {
    }

    public fetchExpenses(): void {
        if (!this.calendar || !this.dateRange) {
            return;
        }

        this.expenseApiService
            .list(this.calendar, this.dateRange.fromDate, this.dateRange.toDate)
            .subscribe((expenses: Expense[]) => this.expenses = expenses)
        ;
    }
}
