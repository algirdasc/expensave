import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Component, effect, inject, Type } from '@angular/core';
import {
    NbCalendarCell,
    NbCalendarDayPickerComponent,
    NbCalendarMonthModelService,
    NbCardModule,
} from '@nebular/theme';
import { APP_CONFIG } from '../../../app.initializer';
import { CalendarGridRowCellDesktopComponent } from '../components/calendar/calendar-grid-row-cell-desktop/calendar-grid-row-cell-desktop.component';
import { CalendarGridRowCellMobileComponent } from '../components/calendar/calendar-grid-row-cell-mobile/calendar-grid-row-cell-mobile.component';
import { CalendarMonthModelService } from './calendar-month-model.service';
import { CalendarDayNamesComponent } from '../components/calendar/calendar-day-names/calendar-day-names.component';
import { CalendarGridComponent } from '../components/calendar/calendar-grid/calendar-grid.component';
import { CalendarExpenseListMobileComponent } from '../components/calendar/calendar-expense-list-mobile/calendar-expense-list-mobile.component';
import { MainStore } from '../main.store';
import { CalendarQueries } from '../../../queries/calendar.queries';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
    styleUrls: ['calendar.component.scss'],
    templateUrl: 'calendar.component.html',
    selector: 'app-calendar',
    imports: [NbCardModule, CalendarDayNamesComponent, CalendarGridComponent, CalendarExpenseListMobileComponent],
})
export class CalendarComponent extends NbCalendarDayPickerComponent<Date, Date> {
    mainStore = inject(MainStore);
    unusedMonthModelService: NbCalendarMonthModelService<Date>;
    monthModelService = inject<CalendarMonthModelService<Date>>(CalendarMonthModelService);
    cellComponent: Type<NbCalendarCell<Date, Date>> = CalendarGridRowCellDesktopComponent;
    calendarQueries = inject(CalendarQueries);
    calendarExpenseQuery = injectQuery(() =>
        this.calendarQueries.listExpenses(
            this.mainStore.selectedCalendar(),
            this.mainStore.selectedPeriod().from,
            this.mainStore.selectedPeriod().to
        )
    );

    constructor() {
        const unusedMonthModelService = inject<NbCalendarMonthModelService<Date>>(NbCalendarMonthModelService);
        super(unusedMonthModelService);
        this.unusedMonthModelService = unusedMonthModelService;

        effect(() => {
            this.visibleDate = this.mainStore.selectedMonth();

            this.cellComponent = this.mainStore.isMobile()
                ? CalendarGridRowCellMobileComponent
                : CalendarGridRowCellDesktopComponent;

            this.weeks = this.monthModelService.createDaysGrid(
                this.visibleDate,
                this.boundingMonths,
                getLocaleFirstDayOfWeek(APP_CONFIG.locale)
            );

            this.mainStore.selectedPeriod.set({
                from: this.weeks[0][0],
                to: this.weeks[this.weeks.length - 1][6],
            });
        });
    }
}
