import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { slideAnimation } from '../../../../animations/slide.animation';
import { Expense } from '../../../../api/objects/expense';
import { APP_CONFIG } from '../../../../app.initializer';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';

export const DIALOG_ACTION_IMPORT = 'import';
export const DIALOG_ACTION_CANCEL = 'cancel';
export const DIALOG_ACTION_CLOSE = 'close';

@Component({
    templateUrl: 'statement-review-dialog.component.html',
    styleUrl: 'statement-review-dialog.component.scss',
    animations: slideAnimation,
    standalone: false,
})
export class StatementReviewDialogComponent implements OnInit {
    public expenses: Expense[] = [];
    public onImportChange: (expenses: Expense[]) => void;

    protected groupedByDates: { [key: string]: Expense[] } = {};
    protected totalExpensesAmountByDates: { [key: string]: number } = {};
    protected totalExpensesAmount: number = 0;

    private datePipe: DatePipe;
    protected calendarRefreshNeeded: boolean = false;

    public constructor(
        protected readonly dialogRef: NbDialogRef<StatementReviewDialogComponent>,
        private readonly dialogService: NbDialogService
    ) {
        this.datePipe = new DatePipe(APP_CONFIG.locale);
    }

    public ngOnInit(): void {
        this.reloadGroupedExpenses();
    }

    public openExpense(expense: Expense): void {
        const expenseDialog = this.dialogService.open(ExpenseDialogComponent, {
            context: {
                expense: expense,
                showTransferTab: false,
                showBalanceTab: false,
                deletable: true,
                onExpenseDelete: () => {
                    this.removeExpenseFromList(expense);

                    expenseDialog.close();

                    // Close review if no expenses to import is left
                    if (!this.expenses.length) {
                        this.dialogRef.close({
                            action: DIALOG_ACTION_CLOSE,
                            calendarRefreshNeeded: this.calendarRefreshNeeded,
                        });
                    }
                },
            },
        });

        expenseDialog.onClose.subscribe((savedExpense: Expense) => {
            if (!savedExpense) {
                return;
            }

            this.removeExpenseFromList(expense);
            this.calendarRefreshNeeded = true;
        });
    }

    public importExpenses(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: `Are you sure you want to import ${this.expenses.length} transactions?`,
                },
            })
            .onClose.subscribe((result: boolean) => {
                if (result) {
                    this.dialogRef.close({
                        action: DIALOG_ACTION_IMPORT,
                        calendarRefreshNeeded: this.calendarRefreshNeeded,
                    });
                }
            });
    }

    public cancelImport(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: 'Are you sure you want to cancel this import?',
                },
            })
            .onClose.subscribe((result: boolean) => {
                if (result) {
                    this.dialogRef.close({
                        action: DIALOG_ACTION_CANCEL,
                        calendarRefreshNeeded: this.calendarRefreshNeeded,
                    });
                }
            });
    }

    private reloadGroupedExpenses(): void {
        this.groupedByDates = {};
        this.totalExpensesAmountByDates = {};
        this.totalExpensesAmount = 0;

        this.expenses.forEach((expense: Expense) => {
            this.totalExpensesAmount += expense.amount;
            const expenseGroup = this.expenseGroup(expense);

            if (!this.groupedByDates[expenseGroup]) {
                this.groupedByDates[expenseGroup] = [];
                this.totalExpensesAmountByDates[expenseGroup] = 0;
            }

            this.groupedByDates[expenseGroup].push(expense);
            this.totalExpensesAmountByDates[expenseGroup] += expense.amount;
        });
    }

    public removeExpenseFromList(expense: Expense): void {
        const index = this.expenses.indexOf(expense);
        if (index === -1) {
            return;
        }

        this.expenses.splice(index, 1);

        this.reloadGroupedExpenses();
        this.onImportChange(this.expenses);
    }

    private expenseGroup(expense: Expense): string {
        return this.datePipe.transform(expense.createdAt);
    }

    protected readonly Object = Object;
    protected readonly DIALOG_ACTION_CLOSE = DIALOG_ACTION_CLOSE;
}
