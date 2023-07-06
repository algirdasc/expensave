import {Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, Type} from '@angular/core';
import {NbCalendarCell, NbCalendarPickerRowComponent} from '@nebular/theme';
import {ResizedEvent} from 'angular-resize-event';
import {Expense} from '../../../../api/entities/expense.entity';
import {CalendarGridRowCellComponent} from '../calendar-grid-row-cell/calendar-grid-row-cell.component';
import {Calendar} from '../../../../api/entities/calendar.entity';

@Component({
  selector: 'app-calendar-grid-row',
  styleUrls: ['calendar-grid-row.component.scss'],
  template: '<ng-template></ng-template>'
})
export class CalendarGridRowComponent extends NbCalendarPickerRowComponent<Date, any> implements OnChanges {
  @Input() public component: Type<CalendarGridRowCellComponent>;
  @Input() public calendar: Calendar;
  @Input() public rowResizedEvent: ResizedEvent;
  private _expenses: Expense[];

  constructor(private c: ComponentFactoryResolver, private _element: ElementRef) {
    super(c);
  }

  @Input()
  get expenses(): Expense[] {
    return this._expenses;
  }

  set expenses(value: Expense[]) {
    const min = this.row[0].getTime();
    const max = this.row[6].getTime();

    this._expenses = value.filter((expense: Expense) => {
      return min <= expense.createdAt.getTime() && expense.createdAt.getTime() <= max;
    });
  }

  public ngOnChanges(): void {
    const factory = this.c.resolveComponentFactory(this.component);

    this.containerRef.clear();

    this.row.forEach((date: Date) => {
      const component = this.containerRef.createComponent(factory);
      this.patchContext(component.instance, date);
      component.changeDetectorRef.detectChanges();
    });
  }

  private patchContext(component: CalendarGridRowCellComponent, date: Date): void {
    component.visibleDate = this.visibleDate;
    component.selectedValue = this.selectedValue;
    component.date = date;
    component.min = this.min;
    component.max = this.max;
    component.filter = this.filter;
    component.size = this.size;
    component.select.subscribe(this.select.emit.bind(this.select));

    component.calendar = this.calendar;
    component.expenses = this.expenses;

    component.onRowHeightChange(this.rowResizedEvent?.newRect.height ?? 0);
  }
}
