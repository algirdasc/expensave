import {Component, Input, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NbCalendarViewMode, NbDateService, NbPopoverDirective, NbSidebarService} from '@nebular/theme';
import {Calendar} from '../../../api/objects/calendar';
import {DateUtil} from '../../../util/date.util';

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    selector: 'app-header',
})
export class HeaderComponent {
    @Input() public calendar: Calendar;
    @Input() public visibleDateBalance: number;
    @Input() public visibleDate: Date;
    @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

    public viewMode: typeof NbCalendarViewMode = NbCalendarViewMode;
    public activeViewMode: NbCalendarViewMode = NbCalendarViewMode.DATE;

    constructor(
        private readonly dateService: NbDateService<Date>,
        private readonly sidebarService: NbSidebarService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    public toggleSidebar(): void {
        this.sidebarService.toggle(false, 'menu-sidebar');
    }

    public changeViewMode(): void {
        if (this.activeViewMode === NbCalendarViewMode.DATE) {
            this.activeViewMode = NbCalendarViewMode.YEAR;
            this.popover.show();
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
        })
    }

    public navigateToday(): void {
        this.navigateToDate(new Date());
    }

    private changeVisibleMonth(direction: number): void {
        this.navigateToDate(this.dateService.addMonth(this.visibleDate, direction));
    }
}
