import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';
import { lastValueFrom } from 'rxjs';
import { ReportsApiService } from '../../../api/reports.api.service';
import { ReportsStore } from '../reports.store';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
    template: '',
})
export abstract class AbstractReportComponent {
    reportsApiService: ReportsApiService = inject(ReportsApiService);
    reportsStore: ReportsStore = inject(ReportsStore);
    reportPeriod: WritableSignal<NbCalendarRange<Date>> = signal<NbCalendarRange<Date>>(null);
    reportQuery = injectQuery(() => {
        const calendars = this.reportsStore.calendars();
        const dateFrom = this.reportPeriod()?.start ?? null;
        const dateTo = this.reportPeriod()?.end ?? null;
        const calendarIds = calendars.map(calendar => calendar.id);

        return {
            queryKey: ['report', this.reportsApiMethod, calendarIds, dateFrom, dateTo],
            queryFn: (): Promise<unknown> =>
                lastValueFrom(
                    this.reportsApiService[this.reportsApiMethod](this.reportsStore.calendars(), dateFrom, dateTo)
                ),
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

    abstract cleanUp(): void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract parseReport(response: any): void;
}
