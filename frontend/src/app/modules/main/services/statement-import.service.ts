import { Injectable, inject } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { ExpenseApiService } from '../../../api/expense.api.service';
import { Calendar } from '../../../api/objects/calendar';
import { Expense } from '../../../api/objects/expense';
import { StatementImportResponse } from '../../../api/response/statement-import.response';
import { StatementImportApiService } from '../../../api/statement-import.api.service';
import { CalendarService } from '../calendar/calendar.service';
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
    private dialogService = inject(NbDialogService);
    private mainService = inject(MainService);
    private statementImportApiService = inject(StatementImportApiService);
    private expenseApiService = inject(ExpenseApiService);
    private calendarService = inject(CalendarService);
    private toastrService = inject(NbToastrService);

    public expenses: Expense[] = [];

    public constructor() {
        this.statementImportApiService.onBusyChange.subscribe((isBusy: boolean) =>
            this.mainService.isApplicationBusy.next(isBusy)
        );

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

            this.statementImportApiService.import(calendar, formData).subscribe((response: StatementImportResponse) => {
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
            });
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
                        this.expenseApiService.import(this.expenses).subscribe(() => {
                            this.toastrService.success(
                                'Transactions are being imported, please be patient',
                                TOASTR_TITLE
                            );

                            this.clearImportStorage();
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
        this.expenseApiService.import(this.expenses).subscribe(() => {});
    }
}
