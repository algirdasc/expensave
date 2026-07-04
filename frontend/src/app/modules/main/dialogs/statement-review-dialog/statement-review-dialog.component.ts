import { DatePipe, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { StatementImportService } from '../../services/statement-import.service';
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
export class StatementReviewDialogComponent {
    // Passed via dialog context
    public importService: StatementImportService;

    protected readonly dialogRef = inject<NbDialogRef<StatementReviewDialogComponent>>(NbDialogRef);
    protected readonly Object = Object;
    protected readonly DIALOG_ACTION_CLOSE = DIALOG_ACTION_CLOSE;
    protected calendarRefreshNeeded: boolean = false;

    private readonly dialogService = inject(NbDialogService);
    private readonly datePipe: DatePipe = new DatePipe(APP_CONFIG.locale);

    protected get expensesCount(): number {
        return this.importService.draft().length;
    }

    protected get groupedByDates(): Record<string, Expense[]> {
        const grouped: Record<string, Expense[]> = {};

        for (const expense of this.importService.draft()) {
            const key = this.expenseGroup(expense);

            if (!grouped[key]) {
                grouped[key] = [];
            }

            grouped[key].push(expense);
        }

        return grouped;
    }

    protected get groupedDates(): string[] {
        return Object.keys(this.groupedByDates);
    }

    protected get totalExpensesAmountByDates(): Record<string, number> {
        const totals: Record<string, number> = {};

        for (const [date, items] of Object.entries(this.groupedByDates)) {
            totals[date] = items.reduce((sum, item) => sum + (item.amount ?? 0), 0);
        }

        return totals;
    }

    protected get totalExpensesAmount(): number {
        return this.importService.draft().reduce((sum, e) => sum + (e.amount ?? 0), 0);
    }

    public openExpense(expense: Expense): void {
        const expenseDialog = this.dialogService.open(ExpenseDialogComponent, {
            context: {
                expense: expense,
                showTransferTab: false,
                showBalanceTab: false,
                deletable: true,
                onExpenseDelete: () => {
                    expenseDialog.close(true);
                },
            },
        });

        expenseDialog.onClose.subscribe((result: Expense | boolean | undefined) => {
            if (!result) {
                return;
            }

            if (result instanceof Expense) {
                this.calendarRefreshNeeded = true;
            }

            this.importService.removeFromDraft(expense);

            if (!this.importService.draft().length) {
                this.dialogRef.close({
                    action: DIALOG_ACTION_CLOSE,
                    calendarRefreshNeeded: this.calendarRefreshNeeded,
                });
            }
        });
    }

    public importExpenses(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: `Are you sure you want to import ${this.importService.draft().length} transactions?`,
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

    private expenseGroup(expense: Expense): string {
        return this.datePipe.transform(expense.createdAt) ?? 'Unknown';
    }
}
