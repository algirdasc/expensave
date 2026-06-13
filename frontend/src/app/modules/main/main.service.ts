import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NbDateService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';
import { Expense } from '../../api/objects/expense';
import { ExpenseBalance } from '../../api/objects/expense-balance';
import { User } from '../../api/objects/user';
import { CalendarExpenseListResponse } from '../../api/response/calendar-expense-list.response';
import { CalendarQueries } from '../../queries/calendar.queries';
import { QueryClient } from '@tanstack/angular-query-experimental';

@Injectable({ providedIn: 'root' })
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
    public isApplicationBusy: Subject<boolean> = new Subject<boolean>();

    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly queryClient = inject(QueryClient);
    private readonly calendarQueries = inject(CalendarQueries);
    private readonly title = inject(Title);
    private _calendar: Calendar;

    public get calendar(): Calendar {
        return this._calendar;
    }

    public set calendar(calendar: Calendar) {
        this._calendar = calendar;

        this.title.setTitle(`Expensave - ${calendar?.name ?? 'No calendar'}`);
    }

    public refreshCalendar(calendar?: Calendar): void {
        const selectedCalendar = calendar ?? this.calendar;
        if (!selectedCalendar || !this.calendarDateFrom || !this.calendarDateTo) {
            return;
        }

        void this.queryClient
            .fetchQuery(
                this.calendarQueries.expenseList(selectedCalendar.id, this.calendarDateFrom, this.calendarDateTo)
            )
            .then((response: CalendarExpenseListResponse) => this.applyCalendarExpensesResponse(response))
            .catch(() => undefined);
    }

    public getSystemCategory(type: string): Category {
        return this.systemCategories.filter((category: Category) => category.type === type)[0];
    }

    private applyCalendarExpensesResponse(response: CalendarExpenseListResponse): void {
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
    }
}

export const SIDEBAR_TAG = 'menu-sidebar';
