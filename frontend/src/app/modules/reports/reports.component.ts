import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Calendar } from '../../api/objects/calendar';
import { User } from '../../api/objects/user';
import { ReportsService } from './reports.service';
import { NbLayoutModule, NbIconModule, NbCardModule, NbListModule, NbCheckboxModule } from '@nebular/theme';
import { NgFor } from '@angular/common';
import { DailyExpensesComponent } from './components/daily-expenses/daily-expenses.component';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';
import { CategoryExpensesComponent } from './components/category-expenses/category-expenses.component';

@Component({
    templateUrl: 'reports.component.html',
    styleUrl: 'reports.component.scss',
    imports: [
        NbLayoutModule,
        NbIconModule,
        RouterLink,
        NbCardModule,
        NbListModule,
        NgFor,
        NbCheckboxModule,
        DailyExpensesComponent,
        MonthlyExpensesComponent,
        CategoryExpensesComponent,
    ],
})
export class ReportsComponent implements OnInit {
    public readonly reportsService = inject(ReportsService);
    private readonly activatedRoute = inject(ActivatedRoute);

    public selectedCalendars: Calendar[] = [];

    public ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ user, calendars }: { user: User; calendars: Calendar[] }) => {
            this.reportsService.user = user;
            this.reportsService.calendars = calendars;

            for (const calendar of calendars) {
                if (calendar.isDefault(user)) {
                    this.selectedCalendars.push(calendar);
                }
            }
        });
    }

    public onCheckedChange(calendar: Calendar, event: boolean): void {
        if (event === true) {
            this.selectedCalendars.push(calendar);
        } else {
            this.selectedCalendars.splice(this.selectedCalendars.indexOf(calendar), 1);
        }

        // Trigger change detection
        this.selectedCalendars = [].concat(this.selectedCalendars);
    }
}
