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

type ReportsRouteData = {
    user: User;
    calendars: Calendar[];
};

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
    public selectedCalendarMap: Record<number, boolean> = {};

    protected readonly activatedRoute = inject(ActivatedRoute);
    protected readonly calendarQueries = inject(CalendarQueries);
    protected readonly calendarListQuery = injectQuery(() => this.calendarQueries.list());
    protected readonly reportsStore = inject(ReportsStore);

    public get calendars(): Calendar[] {
        return this.calendarListQuery.data() ?? [];
    }

    public ngOnInit(): void {
        this.applyRouteData(this.activatedRoute.snapshot.data as ReportsRouteData);
    }

    public onCheckedChange(calendar: Calendar, event: boolean): void {
        this.reportsStore.calendars.update(current => {
            if (event) {
                return current.some(item => item.id === calendar.id) ? current : [...current, calendar];
            }

            return current.filter(item => item.id !== calendar.id);
        });
        this.syncSelectedCalendarMap();
    }

    private applyRouteData({ user, calendars }: ReportsRouteData): void {
        const defaultCalendar = calendars.find((calendar: Calendar) => calendar.isDefault(user));

        this.reportsStore.calendars.set(defaultCalendar ? [defaultCalendar] : []);
        this.syncSelectedCalendarMap();
    }

    private syncSelectedCalendarMap(): void {
        this.selectedCalendarMap = this.reportsStore
            .calendars()
            .reduce((map: Record<number, boolean>, calendar: Calendar) => {
                map[calendar.id] = true;

                return map;
            }, {});
    }
}
