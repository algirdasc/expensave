import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Calendar } from '../../../api/objects/calendar';
import { ReportsApiService } from '../../../api/reports.api.service';

@Component({
    template: '',
})
export abstract class AbstractReportComponent implements OnChanges {
    @Input({ required: true })
    public calendars: Calendar[];

    public isBusy: boolean = false;
    public dateRange: NbCalendarRange<Date>;

    protected fetchSubscription: Subscription;
    protected abstract reportsApiMethod: string;
    protected abstract reportsApiService: ReportsApiService;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.calendars && !changes?.calendars.isFirstChange()) {
            this.fetchReport();
        }
    }

    public onDateRangeChange(event: NbCalendarRange<Date>): void {
        this.dateRange = event;
        this.fetchReport();
    }

    protected preparedToFetch(): boolean {
        if (!this.calendars.length) {
            this.cleanUp();

            return false;
        }

        this.isBusy = true;

        if (this.fetchSubscription) {
            this.fetchSubscription.unsubscribe();
            this.fetchSubscription = undefined;
        }

        return true;
    }

    protected fetchReport(): void {
        if (!this.preparedToFetch()) {
            return;
        }

        this.fetchSubscription = this.reportsApiService[this.reportsApiMethod](
            this.calendars,
            this.dateRange.start,
            this.dateRange.end
        )
            .pipe(finalize(() => (this.isBusy = false)))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .subscribe((response: any) => this.parseReport(response));
    }

    protected abstract cleanUp(): void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected abstract parseReport(response: any): void;
}
