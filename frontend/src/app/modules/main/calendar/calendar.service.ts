import {Injectable} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {plainToInstance} from 'class-transformer';
import {ExpenseApiService} from '../../../api/expense.api.service';
import {Calendar} from '../../../api/objects/calendar';
import {Expense} from '../../../api/objects/expense';
import {DateUtil} from '../../../util/date.util';
import {ExpenseDialogComponent} from '../dialogs/expense-dialog/expense-dialog.component';
import {MainService} from '../main.service';

@Injectable()
export class CalendarService {

    public constructor(
        private expenseApiService: ExpenseApiService,
        private dialogService: NbDialogService,
        private mainService: MainService
    ) {
    }

    public editExpense(expense: Expense): void {
        this.expenseApiService
            .get(expense.id)
            .subscribe((expense: Expense) => {
                this.openExpenseDialog(expense, () => this.mainService.refreshCalendar());
            });
    }

    public createExpense(calendar: Calendar, date: Date): void {
        const expense = plainToInstance(Expense, {
            createdAt: DateUtil.setTime(date, new Date()),
            calendar: calendar,
            user: this.mainService.user,
            confirmed: true,
        });

        this.openExpenseDialog(expense, () => this.mainService.refreshCalendar());
    }

    private openExpenseDialog(expense: Expense, onClose: (result: Expense) => void): void {
        this.dialogService
            .open(ExpenseDialogComponent, {
                context: {
                    expense: expense,
                }
            })
            .onClose
            .subscribe((result?: Expense) => {
                if (result) {
                    onClose(result);
                }
            })
        ;
    }
}
