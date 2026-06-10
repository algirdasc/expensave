import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NbDateService,
    NbLayoutModule,
    NbMediaBreakpointsService,
    NbSidebarModule,
    NbSidebarService,
    NbSpinnerModule,
} from '@nebular/theme';
import { AngularResizeEventModule, ResizedEvent } from 'angular-resize-event';
import { ExpenseApiService } from '../../api/expense.api.service';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';
import { User } from '../../api/objects/user';
import { APP_CONFIG } from '../../app.initializer';
import { SwipeEvent } from '../../interfaces/swipe.interface';
import { DateUtil } from '../../util/date.util';
import { MainService, SIDEBAR_TAG } from './main.service';
import { StatementImportService } from './services/statement-import.service';
import { HeaderComponent } from './header/header.component';
import { SwipeDirective } from '../../directives/swipe.directive';
import { CalendarComponent } from './calendar/calendar.component';
import { OutsideClickDirective } from '../../directives/outside-click.directive';
import { ProfileComponent } from './components/sidebar/profile/profile.component';
import { CalendarSidebarListComponent } from './components/sidebar/calendar-list/calendar-list.component';
import { ActionsComponent } from './components/sidebar/actions/actions.component';
import { take } from 'rxjs';

type MainRouteData = {
    user: User;
    calendars: Calendar[];
    systemCategories: Category[];
};

@Component({
    templateUrl: 'main.component.html',
    styleUrl: 'main.component.scss',
    imports: [
        NbLayoutModule,
        NbSpinnerModule,
        HeaderComponent,
        SwipeDirective,
        AngularResizeEventModule,
        CalendarComponent,
        NbSidebarModule,
        OutsideClickDirective,
        ProfileComponent,
        CalendarSidebarListComponent,
        ActionsComponent,
    ],
})
export class MainComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly expenseApiService = inject(ExpenseApiService);
    private readonly breakpointService = inject(NbMediaBreakpointsService);
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly zone = inject(NgZone);
    private readonly sidebarService = inject(NbSidebarService);
    private readonly statementImportService = inject(StatementImportService);
    public readonly mainService = inject(MainService);

    protected isCalendarBusy = false;
    protected isApplicationBusy = false;
    protected isMobile = false;

    public ngOnInit(): void {
        this.bindBusyStates();
        this.bindResolvedRouteData();
        this.bindVisibleDateQueryParam();

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
        if (sidebarToggler?.contains(event.target as HTMLElement)) {
            return;
        }

        this.sidebarService
            .getSidebarState(SIDEBAR_TAG)
            .pipe(take(1))
            .subscribe(state => {
                if (state !== 'collapsed') {
                    this.sidebarService.collapse(SIDEBAR_TAG);
                }
            });
    }

    private bindBusyStates(): void {
        this.expenseApiService.onBusyChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((isBusy: boolean) => (this.isCalendarBusy = isBusy));

        this.mainService.isApplicationBusy
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((isBusy: boolean) => (this.isApplicationBusy = isBusy));
    }

    private bindResolvedRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data: MainRouteData) => this.applyRouteData(data));
    }

    private bindVisibleDateQueryParam(): void {
        this.activatedRoute.queryParamMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(params => this.updateVisibleDateFromQueryParam(params.get('date')));
    }

    private applyRouteData({ user, calendars, systemCategories }: MainRouteData): void {
        this.mainService.user = user;
        this.mainService.calendars = calendars;
        this.mainService.systemCategories = systemCategories;
        this.mainService.calendar = this.getDefaultCalendar(user, calendars);
    }

    private getDefaultCalendar(user: User, calendars: Calendar[]): Calendar {
        return calendars.find((calendar: Calendar) => calendar.id === user.defaultCalendarId) ?? calendars[0];
    }

    private updateVisibleDateFromQueryParam(date: string | null): void {
        if (!date) {
            return;
        }

        const parsedDate = new Date(`${date}-01 00:00:00`);
        if (!DateUtil.valid(parsedDate)) {
            return;
        }

        parsedDate.setDate(this.mainService.visibleDate.getDate());
        this.mainService.visibleDate = parsedDate;
    }

    protected readonly SIDEBAR_TAG = SIDEBAR_TAG;
    protected readonly APP_CONFIG = APP_CONFIG;
}
