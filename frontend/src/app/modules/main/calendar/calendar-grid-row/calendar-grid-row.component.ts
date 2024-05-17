import {Component, ComponentFactoryResolver, Input, OnChanges, Type} from '@angular/core';
import {NbCalendarPickerRowComponent, NbDateService} from '@nebular/theme';
import {ResizedEvent} from 'angular-resize-event';
import {Calendar} from '../../../../api/objects/calendar';
import {Expense} from '../../../../api/objects/expense';
import {ExpenseBalance} from '../../../../api/objects/expense-balance';
import {CalendarCellInterface} from '../interfaces/calendar-cell.interface';

@Component({
    selector: 'app-calendar-grid-row',
    styleUrls: ['calendar-grid-row.component.scss'],
    template: '<ng-template></ng-template>'
})
export class CalendarGridRowComponent extends NbCalendarPickerRowComponent<Date, Date> implements OnChanges {
    @Input({required: true}) public calendar: Calendar;
    @Input({required: true}) public expenseBalances: ExpenseBalance[];
    @Input({required: true}) public expenses: Expense[];
    @Input() public component: Type<CalendarCellInterface>;
    @Input() public rowResizedEvent: ResizedEvent;

    constructor(
        private c: ComponentFactoryResolver,
        private dateService: NbDateService<Date>,
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

    private patchContext(gridRowCell: CalendarCellInterface, date: Date): void {
        // Nebular fields
        gridRowCell.visibleDate = this.visibleDate;
        gridRowCell.selectedValue = this.selectedValue;
        gridRowCell.date = date;
        // gridRowCell.min = this.min;
        // gridRowCell.max = this.max;
        // gridRowCell.filter = this.filter;
        // gridRowCell.size = this.size;

        // Expensave fields
        gridRowCell.calendar = this.calendar;
        gridRowCell.expenseBalance = this.expenseBalances.filter((balance: ExpenseBalance) => this.dateService.isSameDaySafe(date, balance.balanceAt))[0];
        gridRowCell.expenses = this.expenses.filter((expense: Expense) => {
            const isSameDay = this.dateService.isSameDaySafe(date, expense.createdAt);
            if (isSameDay && !expense.confirmed && !gridRowCell.hasUnconfirmedExpenses) {
                gridRowCell.hasUnconfirmedExpenses = true;
            }

            return isSameDay;
        });

        // Events
        gridRowCell.select.subscribe((date: Date) => this.select.emit(date));
    }
}
