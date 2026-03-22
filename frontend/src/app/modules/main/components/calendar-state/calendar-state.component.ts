import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { Category } from '../../../../api/objects/category';
import { User } from '../../../../api/objects/user';
import { DateUtil } from '../../../../util/date.util';
import { MainService } from '../../main.service';
import { CalendarComponent } from '../../calendar/calendar.component';

@Component({
    selector: 'app-calendar-state',
    template: `
        <app-calendar
            [calendar]="mainService.calendar"
            [expenses]="mainService.expenses"
            [expenseBalances]="mainService.expenseBalances"
            [visibleDate]="mainService.visibleDate"
            [selectedDate]="mainService.visibleDate"
            (rangeChange)="onRangeChange($event)"
            [isMobile]="isMobile">
        </app-calendar>
    `,
    imports: [CalendarComponent],
})
export class CalendarStateComponent implements OnInit {
    @Input() public isMobile: boolean;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    public readonly mainService = inject(MainService);

    public ngOnInit(): void {
        this.activatedRoute.data.subscribe(
            ({
                user,
                calendars,
                systemCategories,
            }: {
                user: User;
                calendars: Calendar[];
                systemCategories: Category[];
            }) => {
                this.mainService.user = user;
                this.mainService.calendars = calendars;
                this.mainService.systemCategories = systemCategories;
                this.mainService.calendar =
                    this.mainService.calendars.filter((calendar: Calendar) => {
                        return calendar.id === user.defaultCalendarId;
                    })[0] || this.mainService.calendars[0];
            }
        );

        this.activatedRoute.queryParams.subscribe(({ date }: { date?: string }) => {
            if (date) {
                const parsedDate = new Date(`${date}-01 00:00:00`);
                if (DateUtil.valid(parsedDate)) {
                    parsedDate.setDate(this.mainService.visibleDate.getDate());
                    this.mainService.visibleDate = parsedDate;
                }
            }
        });
    }

    public onRangeChange({ dateFrom, dateTo }: { dateFrom: Date; dateTo: Date }): void {
        this.mainService.calendarDateFrom = dateFrom;
        this.mainService.calendarDateTo = dateTo;
        this.mainService.refreshCalendar();
    }
}
