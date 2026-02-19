import { Component, inject } from '@angular/core';
import {
    NbButtonModule,
    NbCalendarDayCellComponent,
    NbDateService,
    NbDialogService,
    NbIconModule,
} from '@nebular/theme';
import { AngularResizeEventModule, ResizedEvent } from 'angular-resize-event';
import { Calendar } from '../../../../api/objects/calendar';
import { Expense } from '../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { ExpenseListDialogComponent } from '../../dialogs/expense-list-dialog/expense-list-dialog.component';
import { CalendarService } from '../calendar.service';
import { CalendarCellInterface } from '../interfaces/calendar-cell.interface';
import { CalendarGridRowCellDesktopExpenseItemComponent } from './calendar-grid-row-cell-desktop-expense-item/calendar-grid-row-cell-desktop-expense-item.component';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';

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
    public dateService: NbDateService<Date>;
    public calendarService = inject(CalendarService);
    private dialogService = inject(NbDialogService);

    public calendar: Calendar;
    public expenseBalance: ExpenseBalance;
    public expenses: Expense[];
    public hasUnconfirmedExpenses: boolean = false;
    private expenseListCapacity: number = 1;

    public constructor() {
        const dateService = inject<NbDateService<Date>>(NbDateService);

        super(dateService);

        this.dateService = dateService;
    }

    public onResized(event: ResizedEvent): void {
        this.expenseListCapacity = Math.floor(event.newRect.height / EXPENSE_LIST_ITEM_HEIGHT) - 1;
    }

    public get visibleExpenses(): Expense[] {
        return this.expenses.slice(0, this.expenseListCapacity);
    }

    public get invisibleExpensesCount(): number {
        const visibleCount = this.visibleExpenses.length;
        const totalCount = this.expenses.length;

        if (totalCount > visibleCount) {
            return totalCount - visibleCount;
        }

        return 0;
    }

    public openInvisibleExpenses(): void {
        this.dialogService.open(ExpenseListDialogComponent, {
            context: {
                calendar: this.calendar,
                visibleDate: this.visibleDate,
                expenses: this.expenses,
                calendarService: this.calendarService,
            },
        });
    }
}
