import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NbDateService,
    NbMediaBreakpointsService,
    NbSidebarService,
    NbLayoutModule,
    NbSpinnerModule,
    NbSidebarModule,
} from '@nebular/theme';
import { ResizedEvent, AngularResizeEventModule } from 'angular-resize-event';
import { ExpenseApiService } from '../../api/expense.api.service';
import { APP_CONFIG } from '../../app.initializer';
import { SwipeEvent } from '../../interfaces/swipe.interface';
import { DateUtil } from '../../util/date.util';
import { MainService, SIDEBAR_TAG } from './main.service';
import { StatementImportService } from './services/statement-import.service';
import { HeaderComponent } from './header/header.component';
import { SwipeDirective } from '../../directives/swipe.directive';
import { OutsideClickDirective } from '../../directives/outside-click.directive';
import { ProfileComponent } from './components/sidebar/profile/profile.component';
import { CalendarSidebarListComponent } from './components/sidebar/calendar-list/calendar-list.component';
import { ActionsComponent } from './components/sidebar/actions/actions.component';
import { CalendarStateComponent } from './components/calendar-state/calendar-state.component';

@Component({
    templateUrl: 'main.component.html',
    styleUrl: 'main.component.scss',
    imports: [
        NbLayoutModule,
        NbSpinnerModule,
        HeaderComponent,
        SwipeDirective,
        AngularResizeEventModule,
        NbSidebarModule,
        OutsideClickDirective,
        ProfileComponent,
        CalendarSidebarListComponent,
        ActionsComponent,
        CalendarStateComponent,
    ],
})
export class MainComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly expenseApiService = inject(ExpenseApiService);
    private readonly breakpointService = inject(NbMediaBreakpointsService);
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly zone = inject(NgZone);
    private readonly sidebarService = inject(NbSidebarService);
    private readonly statementImportService = inject(StatementImportService);
    public readonly mainService = inject(MainService);

    protected isCalendarBusy: boolean = false;
    protected isApplicationBusy: boolean = false;
    protected isMobile: boolean;

    public constructor() {
        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isCalendarBusy = isBusy));
        this.mainService.isApplicationBusy.subscribe((isBusy: boolean) => (this.isApplicationBusy = isBusy));
    }

    public ngOnInit(): void {
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
