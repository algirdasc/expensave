import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { NbDateService, NbButtonModule, NbIconModule } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { Expense } from '../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { CalendarService } from '../calendar.service';
import { NgIf } from '@angular/common';
import { CalendarExpenseListMobileItemsComponent } from './calendar-expense-list-mobile-items.component';

@Component({
    selector: 'app-calendar-expense-list-mobile',
    templateUrl: 'calendar-expense-list-mobile.component.html',
    styleUrls: ['calendar-expense-list-mobile.component.scss'],
    imports: [NgIf, CalendarExpenseListMobileItemsComponent, NbButtonModule, NbIconModule],
})
export class CalendarExpenseListMobileComponent implements OnChanges {
    calendarService = inject(CalendarService);
    private dateService = inject<NbDateService<Date>>(NbDateService);

    @Input()
    public isMobile: boolean;

    @Input()
    public calendar: Calendar;

    @Input()
    public selectedValue: Date;

    @Input()
    public expenses: Expense[] = [];

    @Input()
    public expenseBalances: ExpenseBalance[] = [];

    public confirmedExpenses: Expense[];
    public unconfirmedExpenses: Expense[];
    public expenseBalance: ExpenseBalance;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.selectedValue || changes?.expenses || changes?.balances) {
            this.confirmedExpenses = this.expenses.filter((expense: Expense) => {
                return this.dateService.isSameDaySafe(this.selectedValue, expense.createdAt) && expense.confirmed;
            });

            this.unconfirmedExpenses = this.expenses.filter((expense: Expense) => {
                return this.dateService.isSameDaySafe(this.selectedValue, expense.createdAt) && !expense.confirmed;
            });

            this.expenseBalance = this.expenseBalances.filter((balance: ExpenseBalance) => {
                return this.dateService.isSameDaySafe(this.selectedValue, balance.balanceAt);
            })[0];
        }
    }
}
