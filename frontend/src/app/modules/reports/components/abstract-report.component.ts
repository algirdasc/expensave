import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';
import { ReportsStore } from '../reports.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ReportsQueries } from '../../../queries/reports.queries';

@Component({
    template: '',
})
export abstract class AbstractReportComponent {
    reportsQueries: ReportsQueries = inject(ReportsQueries);
    reportsStore: ReportsStore = inject(ReportsStore);
    reportPeriod: WritableSignal<NbCalendarRange<Date>> = signal<NbCalendarRange<Date>>(null);
    reportQuery = injectQuery(() => {
        const calendars = this.reportsStore.calendars();
        const dateFrom = this.reportPeriod()?.start ?? null;
        const dateTo = this.reportPeriod()?.end ?? null;
        const calendarIds = calendars.map(calendar => calendar.id);
        const queryDateFrom = dateFrom ?? new Date(0);
        const queryDateTo = dateTo ?? new Date(0);
        const queryOptions = this.getReportQueryOptions(calendarIds, queryDateFrom, queryDateTo);

        return {
            ...queryOptions,
            enabled: calendars.length > 0 && !!dateFrom && !!dateTo,
        };
    });
    abstract readonly reportsApiMethod: 'dailyExpenses' | 'monthlyExpenses' | 'categoryExpenses';

    constructor() {
        effect(() => {
            const data = this.reportQuery.data();
            if (data) {
                this.parseReport(data);
            } else {
                this.cleanUp();
            }
        });
    }

    get currentReportPeriod(): NbCalendarRange<Date> {
        return this.reportPeriod();
    }

    get isReportFetching(): boolean {
        return this.reportQuery.isFetching();
    }

    onDateRangeChange(event: NbCalendarRange<Date>): void {
        this.reportPeriod.set(event);
    }

    private getReportQueryOptions(
        calendarIds: number[],
        dateFrom: Date,
        dateTo: Date
    ): ReturnType<
        ReportsQueries['dailyExpenses'] | ReportsQueries['monthlyExpenses'] | ReportsQueries['categoryExpenses']
    > {
        switch (this.reportsApiMethod) {
            case 'dailyExpenses':
                return this.reportsQueries.dailyExpenses(calendarIds, dateFrom, dateTo);
            case 'monthlyExpenses':
                return this.reportsQueries.monthlyExpenses(calendarIds, dateFrom, dateTo);
            case 'categoryExpenses':
                return this.reportsQueries.categoryExpenses(calendarIds, dateFrom, dateTo);
        }
    }

    abstract cleanUp(): void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract parseReport(response: any): void;
}
