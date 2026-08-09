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
import { MainService } from '../../main.service';
import { CalendarCellInterface } from '../interfaces/calendar-cell.interface';
import { CalendarGridRowCellDesktopExpenseItemComponent } from './calendar-grid-row-cell-desktop-expense-item/calendar-grid-row-cell-desktop-expense-item.component';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { expenseMatchesSearch, hasExpenseSearchQuery } from '../../../../util/expense-search.util';

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
    public calendar: Calendar;
    public expenseBalance: ExpenseBalance;
    public expenses: Expense[];
    public hasUnconfirmedExpenses: boolean = false;

    private dialogService = inject(NbDialogService);
    private readonly mainService = inject(MainService);
    private expenseListCapacity: number = 1;

    public constructor() {
        const dateService = inject<NbDateService<Date>>(NbDateService);

        super(dateService);

        this.dateService = dateService;
    }

    public get visibleExpenses(): Expense[] {
        return this.expenses.slice(0, this.expenseListCapacity);
    }

    public get invisibleExpenses(): Expense[] {
        return this.expenses.slice(this.expenseListCapacity);
    }

    public get invisibleExpensesCount(): number {
        return this.invisibleExpenses.length;
    }

    protected get hasSearchQuery(): boolean {
        return hasExpenseSearchQuery(this.mainService.searchQuery);
    }

    protected get invisibleSearchMatchesCount(): number {
        if (!this.hasSearchQuery) {
            return 0;
        }

        return this.invisibleExpenses.filter((expense: Expense) =>
            expenseMatchesSearch(expense, this.mainService.searchQuery)
        ).length;
    }

    public onResized(event: ResizedEvent): void {
        this.expenseListCapacity = Math.max(1, Math.floor(event.newRect.height / EXPENSE_LIST_ITEM_HEIGHT) - 1);
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
