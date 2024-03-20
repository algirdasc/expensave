import {Component, ComponentFactoryResolver, Input, OnChanges, Type} from '@angular/core';
import {NbCalendarPickerRowComponent, NbDateService} from '@nebular/theme';
import {ResizedEvent} from 'angular-resize-event';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {Expense} from '../../../../api/entities/expense.entity';
import {Balance} from '../../../../api/response/calendar-expense-list.response';
import {CalendarGridRowCellComponent} from '../calendar-grid-row-cell/calendar-grid-row-cell.component';

@Component({
    selector: 'app-calendar-grid-row',
    styleUrls: ['calendar-grid-row.component.scss'],
    template: '<ng-template></ng-template>'
})
export class CalendarGridRowComponent extends NbCalendarPickerRowComponent<Date, any> implements OnChanges {
    @Input() public component: Type<CalendarGridRowCellComponent>;
    @Input() public calendar: Calendar;
    @Input() public rowResizedEvent: ResizedEvent;
    @Input() public balances: Balance[];
    @Input() public expenses: Expense[];

    constructor(
        private c: ComponentFactoryResolver,
        private dateService: NbDateService<Date>
    ) {
        super(c);
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

    private patchContext(gridRowCell: CalendarGridRowCellComponent, date: Date): void {
        gridRowCell.visibleDate = this.visibleDate;
        gridRowCell.selectedValue = this.selectedValue;
        gridRowCell.date = date;
        gridRowCell.min = this.min;
        gridRowCell.max = this.max;
        gridRowCell.filter = this.filter;
        gridRowCell.size = this.size;
        gridRowCell.select.subscribe(this.select.emit.bind(this.select));

        gridRowCell.calendar = this.calendar;
        gridRowCell.expenses = this.expenses.filter((expense: Expense) => {

            const a = this.dateService.isSameDaySafe(date, expense.createdAt);
            if (a) {
                console.log(date, expense.createdAt);
            }

            return a;
        });

        gridRowCell.balance = this.balances.filter((balance: Balance) => {
            const a = this.dateService.isSameDaySafe(date, balance.balanceAt);
            if (a) {
                console.log(date, balance);
            }

            return a;
        })[0];

        gridRowCell.onRowHeightChange(this.rowResizedEvent?.newRect.height ?? 0);
    }
}
