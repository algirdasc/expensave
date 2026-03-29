import { getLocaleFirstDayOfWeek, WeekDay } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import {
    NbButtonGroupModule,
    NbCalendarRange,
    NbDatepickerModule,
    NbDateService,
    NbRangepickerComponent,
} from '@nebular/theme';
import { APP_CONFIG } from '../../../../app.initializer';
import { DateUtil } from '../../../../util/date.util';

export enum PeriodEnum {
    THIS_WEEK = 'week',
    THIS_MONTH = 'month',
    LAST_MONTH = 'last-month',
    THIS_YEAR = 'year',
    LIFETIME = 'lifetime',
    CUSTOM = 'custom',
}

@Component({
    selector: 'app-reports-period-selector',
    templateUrl: 'period-selector.component.html',
    styleUrl: 'period-selector.component.scss',
    imports: [NbButtonGroupModule, NbDatepickerModule],
})
export class PeriodSelectorComponent implements AfterViewInit {
    @Input({ required: true })
    period: PeriodEnum;

    @Output()
    dateRangeChange: EventEmitter<NbCalendarRange<Date>> = new EventEmitter<NbCalendarRange<Date>>();

    @ViewChild('rangePicker')
    rangePicker: NbRangepickerComponent<Date>;

    @ViewChild('customDateRange')
    customDateRangeButton: ElementRef;

    dateRange: NbCalendarRange<Date>;
    firstDayOfWeek: WeekDay;
    periods: typeof PeriodEnum = PeriodEnum;
    dateService = inject<NbDateService<Date>>(NbDateService);

    constructor() {
        this.firstDayOfWeek = getLocaleFirstDayOfWeek(APP_CONFIG.locale);
    }

    ngAfterViewInit(): void {
        this.rangePicker.attach(this.customDateRangeButton);
    }

    onRangeChange(event: NbCalendarRange<Date>): void {
        if (event.end !== undefined) {
            this.dateRangeChange.emit(this.dateRange);
        }
    }

    onPeriodChange(event: PeriodEnum[]): void {
        const period: PeriodEnum = event.pop();
        const currentDate = new Date();
        const lastMonth = this.dateService.addMonth(currentDate, -1);

        switch (period) {
            case PeriodEnum.THIS_WEEK:
                this.dateRange = <NbCalendarRange<Date>>{
                    start: DateUtil.firstDayOfWeek(currentDate, this.firstDayOfWeek),
                    end: DateUtil.endOfTheDay(DateUtil.firstDayOfWeek(currentDate, this.firstDayOfWeek + 6)),
                };

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.LAST_MONTH:
                this.dateRange = <NbCalendarRange<Date>>{
                    start: this.dateService.createDate(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
                    end: DateUtil.endOfTheDay(
                        this.dateService.createDate(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
                    ),
                };

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.THIS_MONTH:
                this.dateRange = <NbCalendarRange<Date>>{
                    start: this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth(), 1),
                    end: DateUtil.endOfTheDay(
                        this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                    ),
                };

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.THIS_YEAR:
                this.dateRange = <NbCalendarRange<Date>>{
                    start: this.dateService.createDate(currentDate.getFullYear(), 0, 1),
                    end: DateUtil.endOfTheDay(this.dateService.createDate(currentDate.getFullYear(), 11, 31)),
                };

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.LIFETIME:
                this.dateRange = <NbCalendarRange<Date>>{
                    end: DateUtil.endOfTheDay(
                        this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                    ),
                };

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.CUSTOM:
                this.rangePicker.show();
                break;
        }
    }
}
