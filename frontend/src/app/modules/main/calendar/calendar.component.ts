import {
  Component, EventEmitter, Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import {NbCalendarDayPickerComponent, NbCalendarMonthModelService} from '@nebular/theme';
import {Expense} from '../../../api/entities/expense.entity';
import {DateUtil} from '../../../util/date.util';
import {CalendarGridRowCellComponent} from './calendar-grid-row-cell/calendar-grid-row-cell.component';
import {DateRangeChangeEvent} from './events/date-range-change.event';
import {Calendar} from '../../../api/entities/calendar.entity';

@Component({
  styleUrls: ['calendar.component.scss'],
  templateUrl: 'calendar.component.html',
  selector: 'app-calendar'
})
export class CalendarComponent extends NbCalendarDayPickerComponent<any, any> implements OnChanges {
  @Input() public expenses: Expense[];
  @Input() public calendar: Calendar;
  @Output() public dateRangeChange: EventEmitter<DateRangeChangeEvent> = new EventEmitter<DateRangeChangeEvent>();

  public cellComponent = CalendarGridRowCellComponent;

  constructor(
      private readonly monthModelService: NbCalendarMonthModelService<any>,
  ) {
    super(monthModelService);
  }

  public ngOnChanges({visibleDate, boundingMonths}: SimpleChanges): void {
    if (visibleDate || boundingMonths) {
      this.weeks = this.monthModelService.createDaysGrid(this.visibleDate, this.boundingMonths);

      const dateRangeChangeEvent = new DateRangeChangeEvent();

      const lastWeek = this.weeks.length - 1;

      dateRangeChangeEvent.fromDate = this.weeks[0][0];
      dateRangeChangeEvent.toDate = DateUtil.endOfTheDay(this.weeks[lastWeek][6]);

      this.dateRangeChange.emit(dateRangeChangeEvent);
    }
  }
}
