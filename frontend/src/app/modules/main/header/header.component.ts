import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { Calendar } from '../../../api/objects/calendar';
import { DateUtil } from '../../../util/date.util';
import { HeaderCalendarInfoComponent } from './components/header-calendar-info.component';
import { HeaderDatePickerComponent } from './components/header-date-picker.component';
import { HeaderNavButtonsComponent } from './components/header-nav-buttons.component';
import { HeaderSidebarToggleComponent } from './components/header-sidebar-toggle.component';

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    selector: 'app-header',
    imports: [
        HeaderSidebarToggleComponent,
        HeaderCalendarInfoComponent,
        HeaderDatePickerComponent,
        HeaderNavButtonsComponent,
    ],
})
export class HeaderComponent {
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    @Input() public calendar: Calendar;
    @Input() public visibleDateBalance: number;
    @Input() public visibleDate: Date;

    protected navigatePrev(): void {
        this.changeVisibleMonth(-1);
    }

    protected navigateNext(): void {
        this.changeVisibleMonth(1);
    }

    protected navigateToDate(date?: Date): void {
        this.router.navigate(['.'], {
            relativeTo: this.activatedRoute,
            queryParams: { date: this.dateService.format(date, DateUtil.MONTH_DAY_FORMAT) },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    protected navigateToday(): void {
        this.navigateToDate(new Date());
    }

    private changeVisibleMonth(direction: number): void {
        this.navigateToDate(this.dateService.addMonth(this.visibleDate, direction));
    }
}
