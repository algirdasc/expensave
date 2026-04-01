import { inject, Injectable } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { ExpenseApiService } from '../../../api/expense.api.service';
import { Calendar } from '../../../api/objects/calendar';
import { TYPE_BALANCE_UPDATE, TYPE_UNCATEGORIZED } from '../../../api/objects/category';
import { Expense } from '../../../api/objects/expense';
import { DateUtil } from '../../../util/date.util';
import { ExpenseDialogComponent } from '../dialogs/expense-dialog/expense-dialog.component';
import { MainStore } from '../main.store';
import { UserQueries } from '../../../queries/user.queries';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Injectable()
export class CalendarService {
    expenseApiService = inject(ExpenseApiService);
    dialogService = inject(NbDialogService);
    mainStore = inject(MainStore);
    userQueries = inject(UserQueries);
    userQuery = injectQuery(() => this.userQueries.profile());

    editExpense(expense: Expense): void {
        this.expenseApiService.get(expense.id).subscribe((expense: Expense) => {
            this.openExpenseDialog(expense).onClose.subscribe((result: Expense) => {
                if (result) {
                    // this.mainService.refreshCalendar();
                }
            });
        });
    }

    createExpense(calendar: Calendar, date: Date): void {
        const expense = plainToInstance(Expense, {
            createdAt: DateUtil.setTime(date, new Date()),
            calendar: calendar,
            user: this.userQuery.data(),
            confirmed: true,
            category: this.mainStore.getSystemCategory(TYPE_UNCATEGORIZED),
        });

        this.openExpenseDialog(expense).onClose.subscribe((result: Expense) => {
            if (result) {
                // this.mainService.refreshCalendar();
            }
        });
    }

    openExpenseDialog(expense: Expense): NbDialogRef<ExpenseDialogComponent> {
        const predefinedCategories = {};
        predefinedCategories[TYPE_BALANCE_UPDATE] = this.mainStore.getSystemCategory(TYPE_BALANCE_UPDATE);

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
