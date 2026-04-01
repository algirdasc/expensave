import { Component, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    NbLayoutModule,
    NbMediaBreakpointsService,
    NbSidebarModule,
    NbSidebarService,
    NbSpinnerModule,
} from '@nebular/theme';
import { AngularResizeEventModule, ResizedEvent } from 'angular-resize-event';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';
import { User } from '../../api/objects/user';
import { APP_CONFIG } from '../../app.initializer';
import { SwipeEvent } from '../../interfaces/swipe.interface';
import { DateUtil } from '../../util/date.util';
import { SIDEBAR_TAG } from './main.service';
import { StatementImportService } from './services/statement-import.service';
import { HeaderComponent } from './header/header.component';
import { SwipeDirective } from '../../directives/swipe.directive';
import { CalendarComponent } from './calendar/calendar.component';
import { OutsideClickDirective } from '../../directives/outside-click.directive';
import { MainStore } from './main.store';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CalendarQueries } from '../../queries/calendar.queries';
import { injectQuery } from '@tanstack/angular-query-experimental';

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
        SidebarComponent,
    ],
})
export class MainComponent implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    zone = inject(NgZone);
    sidebarService = inject(NbSidebarService);
    statementImportService = inject(StatementImportService);
    breakpointsService = inject(NbMediaBreakpointsService);
    calendarQueries = inject(CalendarQueries);
    calendarListQuery = injectQuery(() => this.calendarQueries.list());
    mainStore = inject(MainStore);

    readonly SIDEBAR_TAG = SIDEBAR_TAG;
    readonly APP_CONFIG = APP_CONFIG;

    public ngOnInit(): void {
        this.activatedRoute.data.subscribe(
            ({ user, systemCategories }: { user: User; systemCategories: Category[] }) => {
                this.mainStore.systemCategories.set(systemCategories);
                this.mainStore.selectedCalendar.set(
                    this.calendarListQuery.data().filter((calendar: Calendar) => {
                        return calendar.id === user.defaultCalendarId;
                    })[0] || this.calendarListQuery.data()[0]
                );
            }
        );

        this.activatedRoute.queryParams.subscribe(({ date }: { date?: string }) => {
            if (!date) {
                return;
            }

            const parsedDate = new Date(`${date}-01 00:00:00`);
            if (DateUtil.valid(parsedDate)) {
                this.mainStore.selectedMonth.set(parsedDate);
            }
        });

        if (this.statementImportService.expenses.length) {
            this.statementImportService.processImport();
        }
    }

    public onResized(event: ResizedEvent): void {
        this.mainStore.isMobile.set(this.breakpointsService.getByName('md').width > event.newRect.width);
    }

    public onSwipeEnd(event: SwipeEvent): void {
        if (event.direction === 'x') {
            this.zone.run(() => {
                //         const newVisibleDate = this.dateService.addMonth(
                //             this.mainService.visibleDate,
                //             event.distance < 0 ? 1 : -1
                //         );
                //         this.router.navigate(['.'], {
                //             relativeTo: this.activatedRoute,
                //             queryParams: { date: this.dateService.format(newVisibleDate, DateUtil.MONTH_DAY_FORMAT) },
                //             queryParamsHandling: 'merge',
                //             replaceUrl: true,
                //         });
            });
        }
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
}
