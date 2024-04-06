import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NbDateService} from '@nebular/theme';
import {CalendarApiService} from '../../api/calendar.api.service';
import {Balance} from '../../api/objects/balance';
import {Calendar} from '../../api/objects/calendar';
import {Expense} from '../../api/objects/expense';
import {User} from '../../api/objects/user';
import {CalendarExpenseListResponse} from '../../api/response/calendar-expense-list.response';

@Injectable()
export class MainService {
    public user: User;
    private _calendar: Calendar;
    public calendarDateFrom: Date;
    public calendarDateTo: Date;
    public visibleDate: Date = new Date();
    public visibleDateBalance: number = 0;
    public expenses: Expense[] = [];
    public balances: Balance[] = [];

    constructor(
        private readonly calendarApiService: CalendarApiService,
        private readonly dateService: NbDateService<Date>,
        private readonly title: Title,
    ) {
    }

    public refreshCalendar(calendar?: Calendar): void {
        if ((!this.calendar && calendar) || !this.calendarDateFrom || !this.calendarDateTo) {
            return;
        }

        this.calendarApiService
            .listExpenses(calendar ?? this.calendar, this.calendarDateFrom, this.calendarDateTo)
            .subscribe((response: CalendarExpenseListResponse) => {
                this.expenses = response.expenses;
                this.balances = response.balances;
                this.calendar = response.calendar;

                this.visibleDateBalance = 0;
                response.balances
                    .filter((balance: Balance) => {
                        return this.dateService.isSameYearSafe(this.visibleDate, balance.balanceAt)
                            && this.dateService.isSameMonthSafe(this.visibleDate, balance.balanceAt)
                    })
                    .forEach((balance: Balance) => {
                        this.visibleDateBalance += balance.expenses;
                    });
            })
        ;
    }

    get calendar(): Calendar {
        return this._calendar;
    }

    set calendar(calendar: Calendar) {
        this._calendar = calendar;

        this.title.setTitle(`Expensave - ${calendar?.name ?? 'No calendar'}`);
    }
}
