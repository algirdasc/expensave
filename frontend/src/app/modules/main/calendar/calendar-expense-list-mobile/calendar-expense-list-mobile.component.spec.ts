import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NbDateService } from '@nebular/theme';
import { Expense } from '../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { CalendarService } from '../calendar.service';
import { CalendarExpenseListMobileComponent } from './calendar-expense-list-mobile.component';

describe('CalendarExpenseListMobileComponent', () => {
    let component: CalendarExpenseListMobileComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CalendarService, useValue: {} },
                {
                    provide: NbDateService,
                    useValue: {
                        isSameDaySafe: (dateA: Date, dateB: Date): boolean =>
                            dateA.toDateString() === dateB.toDateString(),
                    },
                },
            ],
        });

        component = TestBed.runInInjectionContext(() => new CalendarExpenseListMobileComponent());
        component.selectedValue = new Date('2026-01-15T00:00:00');
        component.expenses = [
            expenseWithDate(new Date('2026-01-15T10:00:00'), true),
            expenseWithDate(new Date('2026-01-15T11:00:00'), false),
            expenseWithDate(new Date('2026-01-16T10:00:00'), true),
        ];
    });

    it('recalculates selected-day expenses and balance when expense balances change', (): void => {
        const balance = expenseBalanceWithDate(new Date('2026-01-15T00:00:00'));
        component.expenseBalances = [balance, expenseBalanceWithDate(new Date('2026-01-16T00:00:00'))];

        component.ngOnChanges({
            expenseBalances: new SimpleChange([], component.expenseBalances, false),
        });

        expect(component.confirmedExpenses).toEqual([component.expenses[0]]);
        expect(component.unconfirmedExpenses).toEqual([component.expenses[1]]);
        expect(component.expenseBalance).toBe(balance);
    });
});

const expenseWithDate = (createdAt: Date, confirmed: boolean): Expense => {
    const expense = new Expense();
    expense.createdAt = createdAt;
    expense.confirmed = confirmed;

    return expense;
};

const expenseBalanceWithDate = (balanceAt: Date): ExpenseBalance => {
    const balance = new ExpenseBalance();
    balance.balanceAt = balanceAt;

    return balance;
};
