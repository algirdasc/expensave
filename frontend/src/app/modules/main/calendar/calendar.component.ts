import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, Type} from '@angular/core';
import {
    NbCalendarCell,
    NbCalendarDayPickerComponent,
    NbCalendarMonthModelService,
    NbMediaBreakpointsService
} from '@nebular/theme';
import {ResizedEvent} from 'angular-resize-event';
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
    @Output() public dateRangeChange: EventEmitter<DateRangeChangeEvent> = new EventEmitter<DateRangeChangeEvent>();
    public selectedValue: Date;
    public cellComponent: Type<NbCalendarCell<Date, Date>> = CalendarGridRowCellDesktopComponent;

    constructor(
        private readonly monthModelService: NbCalendarMonthModelService<Date>,
        private readonly breakpointService: NbMediaBreakpointsService,
    ) {
        super(monthModelService);
    }

    public onResize(event: ResizedEvent): void {
        if (this.breakpointService.getByName('sm').width < event.newRect.width) {
            this.cellComponent = CalendarGridRowCellDesktopComponent;
        } else {
            this.cellComponent = CalendarGridRowCellMobileComponent;
        }
    }

    public onSelect(day: Date) {
        console.log('ON SELECT', day);
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
    }
}
