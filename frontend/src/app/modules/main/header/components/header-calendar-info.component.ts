import { DecimalPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { NbDateService, NbPopoverModule } from '@nebular/theme';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { ExpenseReportComponent } from '../../components/expense-report/expense-report.component';
import { MainStore } from '../../main.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CalendarQueries } from '../../../../queries/calendar.queries';

@Component({
    selector: 'app-header-calendar-info',
    template: `
        <div class="mx-3 calendar-info">
            <strong class="d-block">{{ mainStore.selectedCalendar()?.name }}</strong>
            <small class="d-block text-hint">
                <span title="Current balance: {{ mainStore.selectedCalendar()?.balance | number: '.2-2' }}">{{
                    mainStore.selectedCalendar()?.balance | shortNumber
                }}</span>
                @if (calendarBalance()) {
                    <span>
                        •
                        <a
                            href="#"
                            title="This month balance: {{ calendarBalance() | number: '.2-2' }}"
                            [nbPopover]="expenseReportComponent"
                            nbPopoverPlacement="bottom"
                            (click)="$event.preventDefault()"
                            [class.text-success]="calendarBalance() > 0"
                            [class.text-danger]="calendarBalance() < 0">
                            {{ calendarBalance() | shortNumber }}
                        </a>
                    </span>
                }
            </small>
        </div>
    `,
    imports: [NbPopoverModule, ShortNumberPipe, DecimalPipe],
})
export class HeaderCalendarInfoComponent {
    mainStore = inject(MainStore);
    dateService = inject<NbDateService<Date>>(NbDateService);
    calendarQueries = inject(CalendarQueries);
    calendarExpenseQuery = injectQuery(() =>
        this.calendarQueries.listExpenses(
            this.mainStore.selectedCalendar(),
            this.mainStore.selectedPeriod().from,
            this.mainStore.selectedPeriod().to
        )
    );

    expenseReportComponent = ExpenseReportComponent;
    calendarBalance = signal(0);

    constructor() {
        effect(() => {
            const balances = this.calendarExpenseQuery.data()?.expenseBalances ?? [];
            const total = balances.reduce((sum, balance) => sum + balance.change, 0);

            this.calendarBalance.set(total);
        });
    }
}
