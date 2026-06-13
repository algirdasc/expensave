import { inject, Injectable } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { Calendar } from '../../../api/objects/calendar';
import { Expense } from '../../../api/objects/expense';
import { ExpenseQueries } from '../../../queries/expense.queries';
import { StatementImportQueries } from '../../../queries/statement-import.queries';
import {
    DIALOG_ACTION_CANCEL,
    DIALOG_ACTION_IMPORT,
    StatementReviewDialogComponent,
} from '../dialogs/statement-review-dialog/statement-review-dialog.component';
import { MainService } from '../main.service';

export const IMPORT_KEY = 'statementImport';
export const IMPORT_COUNT_KEY = 'statementImportCount';

const TOASTR_TITLE = 'Bank statement import';

@Injectable()
export class StatementImportService {
    public expenses: Expense[] = [];

    private readonly dialogService = inject(NbDialogService);
    private readonly mainService = inject(MainService);
    private readonly statementImportQueries = inject(StatementImportQueries);
    private readonly expenseQueries = inject(ExpenseQueries);
    private readonly toastrService = inject(NbToastrService);
    private readonly statementImportMutation = injectMutation(() => this.statementImportQueries.import());
    private readonly expenseImportMutation = injectMutation(() => this.expenseQueries.import());

    public constructor() {
        this.reloadImportStorage();
    }

    public uploadStatement(calendar: Calendar): void {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.accept = 'text/csv, text/xml, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileInput.onchange = (): void => {
            const formData = new FormData();
            const file = fileInput.files[0];
            formData.append('statement', file, file.name);

            fileInput.remove();

            this.mainService.isApplicationBusy.next(true);
            this.statementImportMutation.mutate(
                { calendar, formData },
                {
                    onSuccess: response => {
                        if (response.expenses.length === 0) {
                            this.toastrService.warning(
                                'Selected file does not contain any importable transactions',
                                TOASTR_TITLE
                            );

                            return;
                        }

                        this.updateImportStorage(response.expenses);
                        this.reloadImportStorage();

                        this.processImport();
                    },
                    onSettled: () => this.mainService.isApplicationBusy.next(false),
                }
            );
        };

        document.body.appendChild(fileInput);
        fileInput.click();
    }

    public updateImportStorage(expenses: Expense[]): void {
        localStorage.setItem(IMPORT_KEY, JSON.stringify(expenses));
        localStorage.setItem(IMPORT_COUNT_KEY, expenses.length.toString());
    }

    public reloadImportStorage(): void {
        const localExpenses = localStorage.getItem(IMPORT_KEY);
        if (localExpenses !== null) {
            const expenses = JSON.parse(localExpenses);
            this.expenses = [];
            for (const expense of expenses) {
                this.expenses.push(plainToInstance(Expense, expense));
            }
        }
    }

    public clearImportStorage(): void {
        localStorage.removeItem(IMPORT_KEY);
        localStorage.removeItem(IMPORT_COUNT_KEY);
        this.expenses = [];
    }

    public processImport(): void {
        this.dialogService
            .open(StatementReviewDialogComponent, {
                context: {
                    expenses: this.expenses,
                    onImportChange: (expenses: Expense[]) => {
                        this.updateImportStorage(expenses);
                    },
                },
            })
            .onClose.subscribe((result: { action: string; calendarRefreshNeeded: boolean }) => {
                switch (result.action) {
                    case DIALOG_ACTION_IMPORT:
                        this.mainService.isApplicationBusy.next(true);
                        this.expenseImportMutation.mutate(this.expenses, {
                            onSuccess: () => {
                                this.toastrService.success(
                                    'Transactions are being imported, please be patient',
                                    TOASTR_TITLE
                                );

                                this.clearImportStorage();
                            },
                            onSettled: () => this.mainService.isApplicationBusy.next(false),
                        });
                        break;
                    case DIALOG_ACTION_CANCEL:
                        this.clearImportStorage();
                        break;
                }

                if (result.calendarRefreshNeeded) {
                    this.mainService.refreshCalendar();
                }
            });
    }

    public importStorage(): void {
        this.expenseImportMutation.mutate(this.expenses);
    }
}
