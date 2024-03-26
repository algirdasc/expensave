import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, Type} from '@angular/core';
import {NbCalendarCell, NbCalendarDayPickerComponent, NbCalendarMonthModelService,} from '@nebular/theme';
import {Balance} from '../../../api/objects/balance';
import {Calendar} from '../../../api/objects/calendar';
import {Expense} from '../../../api/objects/expense';
import {DateUtil} from '../../../util/date.util';
import {
    CalendarGridRowCellDesktopComponent
} from './calendar-grid-row-cell-desktop/calendar-grid-row-cell-desktop.component';
import {
    CalendarGridRowCellMobileComponent
} from './calendar-grid-row-cell-mobile/calendar-grid-row-cell-mobile.component';
import {CalendarMonthModelService} from './calendar-month-model.service';

@Component({
    styleUrls: ['calendar.component.scss'],
    templateUrl: 'calendar.component.html',
    selector: 'app-calendar'
})
export class CalendarComponent extends NbCalendarDayPickerComponent<Date, Date> implements OnChanges {
    @Input() public isMobile: boolean;
    @Input({required: true}) public expenses: Expense[];
    @Input({required: true}) public balances: Balance[];
    @Input({required: true}) public calendar: Calendar;
    @Output() public calendarChange: EventEmitter<Calendar> = new EventEmitter<Calendar>();
    @Output() public rangeChange: EventEmitter<{ dateFrom: Date, dateTo: Date }> = new EventEmitter<{dateFrom: Date; dateTo: Date}>();
    public selectedDate: Date;
    public cellComponent: Type<NbCalendarCell<Date, Date>> = CalendarGridRowCellDesktopComponent;

    constructor(
        private readonly unusedMonthModelService: NbCalendarMonthModelService<Date>,
        private readonly monthModelService: CalendarMonthModelService<Date>,
    ) {
        super(unusedMonthModelService);
    }

    public onSelect(day: Date) {
        super.onSelect(day);
        this.selectedDate = day;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes?.visibleDate || changes?.boundingMonths) {
            // TODO: resolve first day of week from locale
            this.weeks = this.monthModelService.createDaysGrid(this.visibleDate, this.boundingMonths);

            const dateFrom = this.weeks[0][0];
            const dateTo = DateUtil.endOfTheDay(this.weeks[this.weeks.length - 1][6]);

            this.rangeChange.emit({dateFrom: dateFrom, dateTo: dateTo});
        }

        if (changes?.isMobile) {
            this.cellComponent = this.isMobile ? CalendarGridRowCellMobileComponent : CalendarGridRowCellDesktopComponent;
        }

        if (changes?.calendar) {
            // this.calendarChange.emit(changes?.calendar.currentValue);
        }
    }
}
