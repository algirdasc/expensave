import { inject, Injectable } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { instanceToInstance, plainToInstance } from 'class-transformer';
import { Calendar } from '../../../api/objects/calendar';
import { Category, TYPE_BALANCE_UPDATE, TYPE_UNCATEGORIZED } from '../../../api/objects/category';
import { Expense } from '../../../api/objects/expense';
import { DateUtil } from '../../../util/date.util';
import { ExpenseDialogComponent } from '../dialogs/expense-dialog/expense-dialog.component';
import { CategoryQueries } from '../../../queries/category.queries';
import { UserQueries } from '../../../queries/user.queries';
import { injectQuery } from '@tanstack/angular-query-experimental';

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in -- Intentionally scoped through MainModule providers.
@Injectable()
export class CalendarService {
    private readonly dialogService = inject(NbDialogService);
    private readonly categoryQueries = inject(CategoryQueries);
    private readonly userQueries = inject(UserQueries);
    private readonly systemCategoriesQuery = injectQuery(() => this.categoryQueries.system());
    private readonly userProfileQuery = injectQuery(() => this.userQueries.profile());

    public editExpense(expense: Expense): void {
        this.openExpenseDialog(instanceToInstance(expense));
    }

    public createExpense(calendar: Calendar, date: Date): void {
        const user = this.userProfileQuery.data();
        const uncategorizedCategory = this.getSystemCategory(TYPE_UNCATEGORIZED);
        if (!user || !uncategorizedCategory) {
            return;
        }

        const expense = plainToInstance(Expense, {
            createdAt: DateUtil.setTime(date, new Date()),
            calendar: calendar,
            user: user,
            confirmed: true,
            category: uncategorizedCategory,
        });

        this.openExpenseDialog(expense);
    }

    private openExpenseDialog(expense: Expense): NbDialogRef<ExpenseDialogComponent> {
        const predefinedCategories = {};
        predefinedCategories[TYPE_BALANCE_UPDATE] = this.getSystemCategory(TYPE_BALANCE_UPDATE);

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

    private getSystemCategory(type: string): Category | undefined {
        return this.systemCategoriesQuery.data()?.find((category: Category) => category.type === type);
    }
}
