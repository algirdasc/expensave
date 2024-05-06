import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Calendar} from '../../api/objects/calendar';
import {User} from '../../api/objects/user';
import {ReportsService} from './reports.service';

@Component({
    templateUrl: 'reports.component.html'
})
export class ReportsComponent implements OnInit {

    public selectedCalendars: Calendar[] = [];

    public constructor(
        public readonly reportsService: ReportsService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
    }

    public ngOnInit(): void {
        this.activatedRoute.data.subscribe(({user, calendars}: { user: User, calendars: Calendar[] }) => {
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
