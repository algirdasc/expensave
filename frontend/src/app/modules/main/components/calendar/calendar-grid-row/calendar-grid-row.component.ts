import { Component, inject, Input, OnChanges, Type } from '@angular/core';
import { NbCalendarCell, NbCalendarPickerRowComponent, NbDateService } from '@nebular/theme';
import { CalendarExpenseListResponse } from '../../../../../api/response/calendar-expense-list.response';
import { CalendarCellInterface } from '../interfaces/calendar-cell.interface';
import { Expense } from '../../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../../api/objects/expense-balance';

@Component({
    selector: 'app-calendar-grid-row',
    styleUrls: ['calendar-grid-row.component.scss'],
    template: '<ng-template></ng-template>',
})
export class CalendarGridRowComponent extends NbCalendarPickerRowComponent<Date, Date> implements OnChanges {
    dateService = inject<NbDateService<Date>>(NbDateService);
    @Input() expenseData: CalendarExpenseListResponse;
    @Input() component: Type<CalendarCellInterface>;

    // @Input() public rowResizedEvent: ResizedEvent;

    ngOnChanges() {
        this.containerRef.clear();

        this.row.forEach((date: Date) => {
            const component = this.containerRef.createComponent(this.component, { index: this.containerRef.length });
            this.patchComponentContext(component.instance, date);
            component.changeDetectorRef.detectChanges();
        });
    }

    patchComponentContext(gridRowCell: NbCalendarCell<Date, Date> & CalendarCellInterface, date: Date): void {
        // Built-in fields
        gridRowCell.visibleDate = this.visibleDate;
        gridRowCell.selectedValue = this.selectedValue;
        gridRowCell.date = date;
        gridRowCell.filter = this.filter;
        gridRowCell.size = this.size;

        if (this.expenseData) {
            gridRowCell.expenses = this.expenseData.expenses.filter((expense: Expense) =>
                this.dateService.isSameDaySafe(date, expense.createdAt)
            );
            gridRowCell.balance = this.expenseData.expenseBalances.filter((balance: ExpenseBalance) =>
                this.dateService.isSameDaySafe(date, balance.balanceAt)
            )[0];
            gridRowCell.calendar = this.expenseData.calendar;
        }
    }
}
