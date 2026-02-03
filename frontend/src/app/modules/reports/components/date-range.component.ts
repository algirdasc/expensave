import { Component, Input } from '@angular/core';
import { NbCalendarRange, NbIconModule } from '@nebular/theme';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-date-range',
    template: ` <div class="d-flex justify-content-center">
        @if (dateRange?.start) {
            <span>{{ dateRange.start | date }}</span>
        } @else {
            <span> Beginning of universe </span>
            <nb-icon icon="arrow-forward-outline" class="mx-3"></nb-icon>
            {{ dateRange?.end | date }}
        }
    </div>`,
    imports: [NbIconModule, DatePipe],
})
export class DateRangeComponent {
    @Input({ required: true })
    public dateRange: NbCalendarRange<Date>;
}
