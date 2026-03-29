import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Calendar } from '../../api/objects/calendar';
import { NbCardModule, NbCheckboxModule, NbIconModule, NbLayoutModule, NbListModule } from '@nebular/theme';
import { DailyExpensesComponent } from './components/daily-expenses/daily-expenses.component';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';
import { CategoryExpensesComponent } from './components/category-expenses/category-expenses.component';
import { CalendarQueries } from '../../queries/calendar.queries';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ReportsStore } from './reports.store';
import { User } from '../../api/objects/user';

@Component({
    templateUrl: 'reports.component.html',
    styleUrl: 'reports.component.scss',
    imports: [
        NbLayoutModule,
        NbIconModule,
        RouterLink,
        NbCardModule,
        NbListModule,
        NbCheckboxModule,
        DailyExpensesComponent,
        MonthlyExpensesComponent,
        CategoryExpensesComponent,
    ],
})
export class ReportsComponent implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    calendarQueries = inject(CalendarQueries);
    calendarListQuery = injectQuery(() => this.calendarQueries.list());
    reportsStore = inject(ReportsStore);

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ user, calendars }: { user: User; calendars: Calendar[] }) => {
            for (const calendar of calendars) {
                if (calendar.isDefault(user)) {
                    this.reportsStore.calendars.set([calendar]);
                }
            }
        });
    }

    onCheckedChange(calendar: Calendar, event: boolean): void {
        this.reportsStore.calendars.update(current => {
            if (event) {
                return current.some(item => item.id === calendar.id) ? current : [...current, calendar];
            }

            return current.filter(item => item.id !== calendar.id);
        });
    }

    isCalendarSelected(calendar: Calendar): boolean {
        return this.reportsStore.calendars().some(item => item.id === calendar.id);
    }
}
