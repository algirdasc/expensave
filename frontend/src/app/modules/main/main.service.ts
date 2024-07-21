import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NbDateService } from '@nebular/theme';
import { CalendarApiService } from '../../api/calendar.api.service';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';
import { Expense } from '../../api/objects/expense';
import { ExpenseBalance } from '../../api/objects/expense-balance';
import { User } from '../../api/objects/user';
import { CalendarExpenseListResponse } from '../../api/response/calendar-expense-list.response';

@Injectable()
export class MainService {
    public user: User;
    public calendars: Calendar[];
    public systemCategories: Category[];
    public calendarDateFrom: Date;
    public calendarDateTo: Date;
    public visibleDate: Date = new Date();
    public visibleDateBalance: number = 0;
    public expenses: Expense[] = [];
    public expenseBalances: ExpenseBalance[] = [];

    private _calendar: Calendar;

    public constructor(
        private readonly calendarApiService: CalendarApiService,
        private readonly dateService: NbDateService<Date>,
        private readonly title: Title
    ) {}

    public refreshCalendar(calendar?: Calendar): void {
        if ((!this.calendar && calendar) || !this.calendarDateFrom || !this.calendarDateTo) {
            return;
        }

        this.calendarApiService
            .listExpenses(calendar ?? this.calendar, this.calendarDateFrom, this.calendarDateTo)
            .subscribe((response: CalendarExpenseListResponse) => {
                this.expenses = response.expenses;
                this.expenseBalances = response.expenseBalances;
                this.calendar = response.calendar;

                this.visibleDateBalance = 0;
                response.expenseBalances
                    .filter((balance: ExpenseBalance) => {
                        return (
                            this.dateService.isSameYearSafe(this.visibleDate, balance.balanceAt) &&
                            this.dateService.isSameMonthSafe(this.visibleDate, balance.balanceAt)
                        );
                    })
                    .forEach((balance: ExpenseBalance) => {
                        this.visibleDateBalance += balance.change;
                    });
            });
    }

    public getSystemCategory(type: string): Category {
        return this.systemCategories.filter((category: Category) => category.type === type)[0];
    }

    public get calendar(): Calendar {
        return this._calendar;
    }

    public set calendar(calendar: Calendar) {
        this._calendar = calendar;

        this.title.setTitle(`Expensave - ${calendar?.name ?? 'No calendar'}`);
    }
}

export const SIDEBAR_TAG = 'menu-sidebar';
