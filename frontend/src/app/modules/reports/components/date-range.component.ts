import { Component, Input } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';

@Component({
    selector: 'app-date-range',
    template: ` <div class="d-flex justify-content-center">
        <span *ngIf="dateRange?.start">
            {{ dateRange.start | date }}
        </span>
        <span *ngIf="!dateRange?.start"> Beginning of universe </span>
        <nb-icon icon="arrow-forward-outline" class="mx-3"></nb-icon>
        {{ dateRange?.end | date }}
    </div>`,
    standalone: false,
})
export class DateRangeComponent {
    @Input({ required: true })
    public dateRange: NbCalendarRange<Date>;
}
