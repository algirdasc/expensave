import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService, NbMediaBreakpointsService, NbSidebarService } from '@nebular/theme';
import { ResizedEvent } from 'angular-resize-event';
import { ExpenseApiService } from '../../api/expense.api.service';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';
import { User } from '../../api/objects/user';
import { APP_CONFIG } from '../../app.initializer';
import { SwipeEvent } from '../../interfaces/swipe.interface';
import { DateUtil } from '../../util/date.util';
import { MainService, SIDEBAR_TAG } from './main.service';
import { StatementImportService } from './services/statement-import.service';

@Component({
    templateUrl: 'main.component.html',
    styleUrl: 'main.component.scss',
    standalone: false
})
export class MainComponent implements OnInit {
    protected isCalendarBusy: boolean = false;
    protected isApplicationBusy: boolean = false;
    protected isMobile: boolean;

    public constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly expenseApiService: ExpenseApiService,
        private readonly breakpointService: NbMediaBreakpointsService,
        private readonly dateService: NbDateService<Date>,
        private readonly zone: NgZone,
        private readonly sidebarService: NbSidebarService,
        public readonly mainService: MainService,
        private readonly statementImportService: StatementImportService
    ) {
        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isCalendarBusy = isBusy));
        this.mainService.isApplicationBusy.subscribe((isBusy: boolean) => (this.isApplicationBusy = isBusy));
    }

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

        if (this.statementImportService.expenses.length) {
            this.statementImportService.processImport();
        }
    }

    public onResized(event: ResizedEvent): void {
        this.isMobile = this.breakpointService.getByName('md').width > event.newRect.width;
    }

    public onSwipeEnd(event: SwipeEvent): void {
        if (event.direction === 'x') {
            this.zone.run(() => {
                const newVisibleDate = this.dateService.addMonth(
                    this.mainService.visibleDate,
                    event.distance < 0 ? 1 : -1
                );
                this.router.navigate(['.'], {
                    relativeTo: this.activatedRoute,
                    queryParams: { date: this.dateService.format(newVisibleDate, DateUtil.MONTH_DAY_FORMAT) },
                    queryParamsHandling: 'merge',
                    replaceUrl: true,
                });
            });
        }
    }

    public onRangeChange({ dateFrom, dateTo }: { dateFrom: Date; dateTo: Date }): void {
        this.mainService.calendarDateFrom = dateFrom;
        this.mainService.calendarDateTo = dateTo;

        this.mainService.refreshCalendar();
    }

    public onCalendarChange(calendar: Calendar): void {
        this.mainService.refreshCalendar(calendar);
    }

    public onSidebarOutsideClick(event: MouseEvent): void {
        const sidebarToggler = document.getElementById('sidebar-toggler');
        if (sidebarToggler.contains(event.target as HTMLElement)) {
            return;
        }

        this.sidebarService.getSidebarState(SIDEBAR_TAG).subscribe(state => {
            if (state !== 'collapsed') {
                this.sidebarService.collapse(SIDEBAR_TAG);
            }
        });
    }

    protected readonly SIDEBAR_TAG = SIDEBAR_TAG;
    protected readonly APP_CONFIG = APP_CONFIG;
}
