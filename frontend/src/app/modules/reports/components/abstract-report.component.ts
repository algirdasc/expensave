import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';
import { ReportsStore } from '../reports.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ReportMethod, ReportResponse, ReportsQueries } from '../../../queries/reports.queries';

@Component({
    template: '',
})
export abstract class AbstractReportComponent<TReportResponse extends ReportResponse = ReportResponse> {
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

        return {
            ...this.reportsQueries.report(this.reportsApiMethod, calendarIds, queryDateFrom, queryDateTo),
            enabled: calendars.length > 0 && !!dateFrom && !!dateTo,
        };
    });
    abstract readonly reportsApiMethod: ReportMethod;

    constructor() {
        effect(() => {
            const data = this.reportQuery.data();
            if (data) {
                this.parseReport(data as TReportResponse);
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

    abstract cleanUp(): void;

    abstract parseReport(response: TReportResponse): void;
}
