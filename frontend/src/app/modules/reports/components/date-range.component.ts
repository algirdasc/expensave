import { Component, Input } from '@angular/core';
import { NbCalendarRange, NbIconModule } from '@nebular/theme';
import { NgIf, DatePipe } from '@angular/common';

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
    imports: [NgIf, NbIconModule, DatePipe],
})
export class DateRangeComponent {
    @Input({ required: true })
    public dateRange: NbCalendarRange<Date>;
}
