import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService, NbSidebarService } from '@nebular/theme';
import { Calendar } from '../../../api/objects/calendar';
import { DateUtil } from '../../../util/date.util';
import { SIDEBAR_TAG } from '../main.service';
import { StatementImportService } from '../services/statement-import.service';
import { SidebarToggleComponent } from './components/sidebar-toggle/sidebar-toggle.component';
import { CalendarInfoComponent } from './components/calendar-info/calendar-info.component';
import { DateNavigationComponent } from './components/date-navigation/date-navigation.component';

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    selector: 'app-header',
    imports: [SidebarToggleComponent, CalendarInfoComponent, DateNavigationComponent],
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

    public toggleSidebar(): void {
        this.sidebarService.toggle(false, SIDEBAR_TAG);
    }

    public navigatePrev(): void {
        this.changeVisibleMonth(-1);
    }

    public navigateNext(): void {
        this.changeVisibleMonth(1);
    }

    public navigateToDate(date: Date): void {
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
