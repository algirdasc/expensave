import {getLocaleFirstDayOfWeek, WeekDay} from '@angular/common';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NbCalendarRange, NbDateService, NbRangepickerComponent} from '@nebular/theme';
import {APP_CONFIG} from '../../../../app.initializer';
import {DateUtil} from '../../../../util/date.util';

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
})
export class PeriodSelectorComponent implements AfterViewInit {
    public dateRange: NbCalendarRange<Date>;
    public firstDayOfWeek: WeekDay;
    public periods: typeof PeriodEnum = PeriodEnum;

    @Input({ required: true }) period: PeriodEnum;
    @Output() dateRangeChange: EventEmitter<NbCalendarRange<Date>> = new EventEmitter<NbCalendarRange<Date>>();

    @ViewChild('rangePicker') rangePicker: NbRangepickerComponent<Date>;
    @ViewChild('customDateRange') customDateRangeButton: ElementRef;

    public constructor(
        private readonly dateService: NbDateService<Date>,
    ) {
       this.firstDayOfWeek = getLocaleFirstDayOfWeek(APP_CONFIG.locale);
    }

    public ngAfterViewInit(): void {
        this.rangePicker.attach(this.customDateRangeButton);
    }

    public onRangeChange(event: NbCalendarRange<Date>) {
        if (event.end !== undefined) {
            this.dateRangeChange.emit(this.dateRange);
        }
    }

    public onPeriodChange(event: PeriodEnum[]): void {
        const period: PeriodEnum = event.pop();
        const currentDate = new Date();
        const lastMonth = this.dateService.addMonth(currentDate, -1);

        switch (period) {
            case PeriodEnum.THIS_WEEK:
                this.dateRange = <NbCalendarRange<Date>> {
                    start: DateUtil.firstDayOfWeek(currentDate, this.firstDayOfWeek),
                    end: DateUtil.firstDayOfWeek(currentDate, this.firstDayOfWeek + 6),
                }

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.LAST_MONTH:
                this.dateRange = <NbCalendarRange<Date>> {
                    start: this.dateService.createDate(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
                    end: DateUtil.endOfTheDay(this.dateService.createDate(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)),
                }

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.THIS_MONTH:
                this.dateRange = <NbCalendarRange<Date>> {
                    start: this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth(), 1),
                    end: DateUtil.endOfTheDay(this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)),
                }

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.THIS_YEAR:
                this.dateRange = <NbCalendarRange<Date>> {
                    start: this.dateService.createDate(currentDate.getFullYear(), 0, 1),
                    end: DateUtil.endOfTheDay(this.dateService.createDate(currentDate.getFullYear(), 11, 31)),
                }

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.LIFETIME:
                this.dateRange = <NbCalendarRange<Date>> {
                    end: DateUtil.endOfTheDay(this.dateService.createDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)),
                }

                this.dateRangeChange.emit(this.dateRange);
                break;
            case PeriodEnum.CUSTOM:
                this.rangePicker.show();
                break;
        }
    }
}
