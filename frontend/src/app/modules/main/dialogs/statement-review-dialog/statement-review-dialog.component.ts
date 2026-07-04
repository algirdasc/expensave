import { DatePipe, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogRef,
    NbDialogService,
    NbIconModule,
    NbListModule,
    NbTooltipModule,
} from '@nebular/theme';
import { slideAnimation } from '../../../../animations/slide.animation';
import { Expense } from '../../../../api/objects/expense';
import { APP_CONFIG } from '../../../../app.initializer';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';

export const DIALOG_ACTION_IMPORT = 'import';
export const DIALOG_ACTION_CANCEL = 'cancel';
export const DIALOG_ACTION_CLOSE = 'close';

@Component({
    templateUrl: 'statement-review-dialog.component.html',
    styleUrl: 'statement-review-dialog.component.scss',
    animations: slideAnimation,
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbListModule, NbTooltipModule, NgStyle, ShortNumberPipe],
})
export class StatementReviewDialogComponent implements OnInit {
    public expenses: Expense[] = [];
    public onImportChange: (expenses: Expense[]) => void;

    protected readonly dialogRef = inject<NbDialogRef<StatementReviewDialogComponent>>(NbDialogRef);
    protected readonly Object = Object;
    protected readonly DIALOG_ACTION_CLOSE = DIALOG_ACTION_CLOSE;
    protected groupedByDates: { [key: string]: Expense[] } = {};
    protected groupedDates: string[] = [];
    protected totalExpensesAmountByDates: { [key: string]: number } = {};
    protected totalExpensesAmount: number = 0;
    protected calendarRefreshNeeded: boolean = false;

    private readonly dialogService = inject(NbDialogService);
    private datePipe: DatePipe;

    public constructor() {
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
                    this.closeIfEmpty();
                },
            },
        });

        expenseDialog.onClose.subscribe((result: Expense | boolean | undefined) => {
            if (!(result instanceof Expense)) {
                return;
            }

            this.removeExpenseFromList(expense);
            this.calendarRefreshNeeded = true;
            this.closeIfEmpty();
        });
    }

    private closeIfEmpty(): void {
        if (!this.expenses.length) {
            this.dialogRef.close({
                action: DIALOG_ACTION_CLOSE,
                calendarRefreshNeeded: this.calendarRefreshNeeded,
            });
        }
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

    public removeExpenseFromList(expense: Expense): void {
        if (this.expenses.indexOf(expense) === -1) {
            return;
        }

        this.expenses = this.expenses.filter(item => item !== expense);

        this.reloadGroupedExpenses();
        this.onImportChange([...this.expenses]);
    }

    private reloadGroupedExpenses(): void {
        this.groupedByDates = {};
        this.groupedDates = [];
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

        this.groupedDates = Object.keys(this.groupedByDates);
    }

    private expenseGroup(expense: Expense): string {
        return this.datePipe.transform(expense.createdAt);
    }
}
