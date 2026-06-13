import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { Calendar } from '../../../api/objects/calendar';
import { TYPE_BALANCE_UPDATE, TYPE_UNCATEGORIZED } from '../../../api/objects/category';
import { Expense } from '../../../api/objects/expense';
import { ExpenseQueries } from '../../../queries/expense.queries';
import { DateUtil } from '../../../util/date.util';
import { ExpenseDialogComponent } from '../dialogs/expense-dialog/expense-dialog.component';
import { MainService } from '../main.service';

@Injectable()
export class CalendarService {
    private readonly dialogService = inject(NbDialogService);
    private readonly mainService = inject(MainService);
    private readonly expenseQueries = inject(ExpenseQueries);
    private readonly queryClient = inject(QueryClient);

    public editExpense(expense: Expense): void {
        void this.queryClient
            .fetchQuery(this.expenseQueries.get(expense.id))
            .then((response: Expense) => {
                this.openExpenseDialog(response).onClose.subscribe((result: Expense) => {
                    if (result) {
                        this.mainService.refreshCalendar();
                    }
                });
            })
            .catch(() => undefined);
    }

    public createExpense(calendar: Calendar, date: Date): void {
        const expense = plainToInstance(Expense, {
            createdAt: DateUtil.setTime(date, new Date()),
            calendar: calendar,
            user: this.mainService.user,
            confirmed: true,
            category: this.mainService.getSystemCategory(TYPE_UNCATEGORIZED),
        });

        this.openExpenseDialog(expense).onClose.subscribe((result: Expense) => {
            if (result) {
                this.mainService.refreshCalendar();
            }
        });
    }

    private openExpenseDialog(expense: Expense): NbDialogRef<ExpenseDialogComponent> {
        const predefinedCategories = {};
        predefinedCategories[TYPE_BALANCE_UPDATE] = this.mainService.getSystemCategory(TYPE_BALANCE_UPDATE);

        return this.dialogService.open(ExpenseDialogComponent, {
            context: {
                expense: expense,
                showBalanceTab: !expense.id || expense.category.type === TYPE_BALANCE_UPDATE,
                showTransferTab: !expense.id,
                deletable: !!expense?.id,
                predefinedCategories: predefinedCategories,
            },
        });
    }
}
