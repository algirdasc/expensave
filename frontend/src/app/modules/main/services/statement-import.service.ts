import { inject, Injectable, signal } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { Calendar } from '../../../api/objects/calendar';
import { Expense } from '../../../api/objects/expense';
import { ExpenseQueries } from '../../../queries/expense.queries';
import { StatementImportQueries } from '../../../queries/statement-import.queries';
import {
    DIALOG_ACTION_CANCEL,
    DIALOG_ACTION_CLOSE,
    DIALOG_ACTION_IMPORT,
    StatementReviewDialogComponent,
} from '../dialogs/statement-review-dialog/statement-review-dialog.component';
import { MainService } from '../main.service';

export const IMPORT_KEY = 'statementImport';
export const IMPORT_COUNT_KEY = 'statementImportCount';

const TOASTR_TITLE = 'Bank statement import';

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in -- Intentionally scoped through MainModule providers.
@Injectable()
export class StatementImportService {
    // Reactive draft — single source of truth for the review dialog
    public readonly draft = signal<Expense[]>([]);

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
            const file = fileInput.files?.[0];
            if (!file) {
                fileInput.remove();

                return;
            }

            const formData = new FormData();
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

                        this.setDraft(response.expenses);
                        this.processImport();
                    },
                    onSettled: () => this.mainService.isApplicationBusy.next(false),
                }
            );
        };

        document.body.appendChild(fileInput);
        fileInput.click();
    }

    public removeFromDraft(expense: Expense): void {
        const key = this.expenseKey(expense);
        this.setDraft(this.draft().filter(item => this.expenseKey(item) !== key));
    }

    public clearImportStorage(): void {
        localStorage.removeItem(IMPORT_KEY);
        localStorage.removeItem(IMPORT_COUNT_KEY);
        this.draft.set([]);
    }

    public reloadImportStorage(): void {
        const raw = localStorage.getItem(IMPORT_KEY);

        if (raw === null) {
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            const expenses = Array.isArray(parsed) ? parsed.map((e: Expense) => plainToInstance(Expense, e)) : [];

            this.draft.set(expenses);
        } catch {
            this.clearImportStorage();
        }
    }

    public processImport(): void {
        this.dialogService
            .open(StatementReviewDialogComponent, {
                context: {
                    importService: this,
                },
            })
            .onClose.subscribe((result: { action: string; calendarRefreshNeeded: boolean }) => {
                if (!result) {
                    return;
                }

                switch (result.action) {
                    case DIALOG_ACTION_IMPORT:
                        this.mainService.isApplicationBusy.next(true);
                        this.expenseImportMutation.mutate(this.draft(), {
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
                    case DIALOG_ACTION_CLOSE:
                        if (!this.draft().length) {
                            this.clearImportStorage();
                        }

                        break;
                }
            });
    }

    private setDraft(expenses: Expense[]): void {
        this.draft.set(expenses);
        localStorage.setItem(IMPORT_KEY, JSON.stringify(expenses));
        localStorage.setItem(IMPORT_COUNT_KEY, String(expenses.length));
    }

    private expenseKey(expense: Expense): string {
        return [
            expense.id ?? 'null',
            expense.label ?? '',
            expense.amount ?? 0,
            expense.createdAt ? new Date(expense.createdAt).toISOString() : '',
        ].join('|');
    }
}
