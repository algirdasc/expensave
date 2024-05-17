import {Input, OnChanges, SimpleChanges} from '@angular/core';
import {NbCalendarRange} from '@nebular/theme';
import {Subscription} from 'rxjs';
import {Calendar} from '../../../api/objects/calendar';

export abstract class AbstractReportComponent implements OnChanges {

    @Input({ required: true }) calendars: Calendar[];

    public isBusy: boolean = false;
    public dateRange: NbCalendarRange<Date>;
    protected fetchSubscription: Subscription;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.calendars && !changes?.calendars.isFirstChange()) {
            this.fetchReport();
        }
    }

    public onDateRangeChange(event: NbCalendarRange<Date>): void {
        this.dateRange = event;
        this.fetchReport();
    }

    public abstract fetchReport(): void;
}
