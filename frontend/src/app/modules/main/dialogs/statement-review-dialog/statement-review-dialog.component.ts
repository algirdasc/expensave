import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ExpenseApiService } from '../../../../api/expense.api.service';
import { Expense } from '../../../../api/objects/expense';
import { APP_CONFIG } from '../../../../app.initializer';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';

@Component({
    templateUrl: 'statement-review-dialog.component.html',
    styleUrl: 'statement-review-dialog.component.scss',
})
export class StatementReviewDialogComponent implements OnInit {
    public expenses: Expense[] = [];
    public onSave: (expenses: Expense[]) => void;

    protected totalExpensesAmount: number = 0;
    protected groupedByDates: { [key: string]: Expense[] } = {};

    public constructor(
        protected readonly dialogRef: NbDialogRef<StatementReviewDialogComponent>,
        private readonly expenseApiService: ExpenseApiService,
        private readonly dialogService: NbDialogService
    ) {}

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
                onExpenseSubmit: () => {
                    this.onSave(this.expenses);
                    expenseDialog.close();
                },
                onExpenseDelete: () => {
                    const index = this.expenses.indexOf(expense);
                    if (index === -1) {
                        return;
                    }

                    this.expenses.splice(index, 1);
                    this.onSave(this.expenses);

                    this.reloadGroupedExpenses();
                    expenseDialog.close();

                    // Close review if no expenses to import is left
                    if (!this.expenses.length) {
                        this.dialogRef.close();
                    }
                },
            },
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
                    this.expenseApiService.import(this.expenses).subscribe(() => {
                        this.dialogRef.close(true);
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
                    this.dialogRef.close(false);
                }
            });
    }

    private reloadGroupedExpenses(): void {
        const datePipe = new DatePipe(APP_CONFIG.locale);

        this.groupedByDates = {};
        this.totalExpensesAmount = 0;

        this.expenses.forEach((expense: Expense) => {
            this.totalExpensesAmount += expense.amount;

            const createdAt = datePipe.transform(expense.createdAt);
            if (!this.groupedByDates[createdAt]) {
                this.groupedByDates[createdAt] = [];
            }

            this.groupedByDates[createdAt].push(expense);
        });
    }

    protected readonly Object = Object;
}
