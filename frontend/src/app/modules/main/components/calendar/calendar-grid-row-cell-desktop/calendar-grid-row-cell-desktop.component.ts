import { Component, inject } from '@angular/core';
import {
    NbButtonModule,
    NbCalendarDayCellComponent,
    NbDateService,
    NbDialogService,
    NbIconModule,
} from '@nebular/theme';
import { AngularResizeEventModule, ResizedEvent } from 'angular-resize-event';
import { Calendar } from '../../../../../api/objects/calendar';
import { Expense } from '../../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../../api/objects/expense-balance';
import { ExpenseListDialogComponent } from '../../../dialogs/expense-list-dialog/expense-list-dialog.component';
import { CalendarService } from '../../../calendar/calendar.service';
import { CalendarGridRowCellDesktopExpenseItemComponent } from './calendar-grid-row-cell-desktop-expense-item/calendar-grid-row-cell-desktop-expense-item.component';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';
import { CalendarCellInterface } from '../interfaces/calendar-cell.interface';

export const EXPENSE_LIST_ITEM_HEIGHT = 21;

@Component({
    templateUrl: 'calendar-grid-row-cell-desktop.component.html',
    styleUrls: ['calendar-grid-row-cell-desktop.component.scss'],
    imports: [
        NbButtonModule,
        NbIconModule,
        AngularResizeEventModule,
        CalendarGridRowCellDesktopExpenseItemComponent,
        ShortNumberPipe,
    ],
})
export class CalendarGridRowCellDesktopComponent
    extends NbCalendarDayCellComponent<Date>
    implements CalendarCellInterface
{
    calendarService = inject(CalendarService);
    dialogService = inject(NbDialogService);
    dateService = inject<NbDateService<Date>>(NbDateService);
    expenses: Expense[];
    balance: ExpenseBalance;
    calendar: Calendar;
    expenseListCapacity: number = 1;

    onResized(event: ResizedEvent): void {
        this.expenseListCapacity = Math.floor(event.newRect.height / EXPENSE_LIST_ITEM_HEIGHT) - 1;
    }

    get hasUnconfirmedExpenses(): boolean {
        return this.expenses?.some((expense: Expense) => !expense.confirmed) ?? false;
    }

    get visibleExpenses(): Expense[] {
        return this.expenses?.slice(0, this.expenseListCapacity) ?? [];
    }

    get invisibleExpensesCount(): number {
        const totalCount = this.expenses?.length ?? 0;
        const visibleCount = this.visibleExpenses?.length ?? 0;

        if (totalCount > visibleCount) {
            return totalCount - visibleCount;
        }

        return 0;
    }

    openInvisibleExpenses(): void {
        this.dialogService.open(ExpenseListDialogComponent, {
            context: {
                visibleDate: this.visibleDate,
                expenses: this.expenses,
                calendarService: this.calendarService,
            },
        });
    }
}
