import { Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NbBadgeModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCalendarViewMode,
    NbDateService,
    NbIconModule,
    NbPopoverDirective,
    NbPopoverModule,
    NbSidebarService,
} from '@nebular/theme';
import { Calendar } from '../../../api/objects/calendar';
import { DateUtil } from '../../../util/date.util';
import { ExpenseReportComponent } from '../components/expense-report/expense-report.component';
import { SIDEBAR_TAG } from '../main.service';
import { StatementImportService } from '../services/statement-import.service';
import { DecimalPipe } from '@angular/common';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { ShortNumberPipe } from '../../../pipes/shortnumber.pipe';

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    selector: 'app-header',
    imports: [
        NbButtonModule,
        NbIconModule,
        NbBadgeModule,
        NbPopoverModule,
        OutsideClickDirective,
        NbCalendarKitModule,
        NbButtonGroupModule,
        ShortNumberPipe,
        DecimalPipe,
    ],
})
export class HeaderComponent {
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly sidebarService = inject(NbSidebarService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    protected readonly statementImportService = inject(StatementImportService);

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
