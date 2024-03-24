import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, Type} from '@angular/core';
import {NbCalendarCell, NbCalendarDayPickerComponent, NbCalendarMonthModelService,} from '@nebular/theme';
import {Calendar} from '../../../api/entities/calendar.entity';
import {Expense} from '../../../api/entities/expense.entity';
import {Balance} from '../../../api/response/calendar-expense-list.response';
import {DateUtil} from '../../../util/date.util';
import {
    CalendarGridRowCellDesktopComponent
} from './calendar-grid-row-cell-desktop/calendar-grid-row-cell-desktop.component';
import {
    CalendarGridRowCellMobileComponent
} from './calendar-grid-row-cell-mobile/calendar-grid-row-cell-mobile.component';
import {DateRangeChangeEvent} from './events/date-range-change.event';

@Component({
    styleUrls: ['calendar.component.scss'],
    templateUrl: 'calendar.component.html',
    selector: 'app-calendar'
})
export class CalendarComponent extends NbCalendarDayPickerComponent<Date, Date> implements OnChanges {
    @Input() public expenses: Expense[];
    @Input() public balances: Balance[];
    @Input() public calendar: Calendar;
    @Input() public isMobile: boolean;
    @Input() public selectedValue: Date;
    @Output() public dateRangeChange: EventEmitter<DateRangeChangeEvent> = new EventEmitter<DateRangeChangeEvent>();
    public cellComponent: Type<NbCalendarCell<Date, Date>> = CalendarGridRowCellDesktopComponent;

    constructor(
        private readonly monthModelService: NbCalendarMonthModelService<Date>,
    ) {
        super(monthModelService);
    }

    public onSelect(day: Date) {
        super.onSelect(day);
        this.selectedValue = day;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.visibleDate || changes?.boundingMonths) {
            // TODO: resolve first day of week from locale
            this.weeks = this.monthModelService.createDaysGrid(this.visibleDate, this.boundingMonths);

            const dateRangeChangeEvent = new DateRangeChangeEvent();
            const lastWeek = this.weeks.length - 1;

            dateRangeChangeEvent.fromDate = this.weeks[0][0];
            dateRangeChangeEvent.toDate = DateUtil.endOfTheDay(this.weeks[lastWeek][6]);

            this.dateRangeChange.emit(dateRangeChangeEvent);
        }

        if (changes?.isMobile) {
            this.cellComponent = this.isMobile ? CalendarGridRowCellMobileComponent : CalendarGridRowCellDesktopComponent;
        }
    }
}
