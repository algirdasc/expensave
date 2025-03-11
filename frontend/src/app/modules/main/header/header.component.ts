import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NbCalendarViewMode,
    NbDateService,
    NbPopoverDirective,
    NbSidebarService,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbPopoverModule,
    NbCalendarKitModule,
    NbButtonGroupModule,
} from '@nebular/theme';
import { Calendar } from '../../../api/objects/calendar';
import { DateUtil } from '../../../util/date.util';
import { ExpenseReportComponent } from '../components/expense-report/expense-report.component';
import { SIDEBAR_TAG } from '../main.service';
import { StatementImportService } from '../services/statement-import.service';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { ShortNumberPipe } from '../../../pipes/shortnumber.pipe';

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    selector: 'app-header',
    imports: [
        NbButtonModule,
        NbIconModule,
        NgIf,
        NbBadgeModule,
        NbPopoverModule,
        OutsideClickDirective,
        NbCalendarKitModule,
        NgSwitch,
        NgSwitchCase,
        NbButtonGroupModule,
        ShortNumberPipe,
    ],
})
export class HeaderComponent {
    @Input()
    public calendar: Calendar;

    @Input()
    public visibleDateBalance: number;

    @Input()
    public visibleDate: Date;

    @ViewChildren(NbPopoverDirective)
    private popovers: QueryList<NbPopoverDirective>;

    public viewMode: typeof NbCalendarViewMode = NbCalendarViewMode;
    public activeViewMode: NbCalendarViewMode = NbCalendarViewMode.DATE;
    public expenseReportComponent = ExpenseReportComponent;

    public constructor(
        private readonly dateService: NbDateService<Date>,
        private readonly sidebarService: NbSidebarService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        protected readonly statementImportService: StatementImportService
    ) {}

    public toggleSidebar(): void {
        this.sidebarService.toggle(false, SIDEBAR_TAG);
    }

    public changeViewMode(): void {
        if (this.activeViewMode === NbCalendarViewMode.DATE) {
            this.activeViewMode = NbCalendarViewMode.YEAR;
            const viewModePopover: NbPopoverDirective = this.popovers.find(
                element => element.context === 'viewModePopover'
            );
            viewModePopover.show();
        } else {
            this.activeViewMode = NbCalendarViewMode.DATE;
        }
    }

    public navigatePrev(): void {
        this.changeVisibleMonth(-1);
    }

    public navigateNext(): void {
        this.changeVisibleMonth(1);
    }

    public navigateToDate(date?: Date): void {
        this.router.navigate(['.'], {
            relativeTo: this.activatedRoute,
            queryParams: { date: this.dateService.format(date, DateUtil.MONTH_DAY_FORMAT) },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    public navigateToday(): void {
        this.navigateToDate(new Date());
    }

    private changeVisibleMonth(direction: number): void {
        this.navigateToDate(this.dateService.addMonth(this.visibleDate, direction));
    }
}
