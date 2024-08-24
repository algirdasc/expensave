import { Injectable } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { Calendar } from '../../../api/objects/calendar';
import { Expense } from '../../../api/objects/expense';
import { StatementImportResponse } from '../../../api/response/statement-import.response';
import { StatementImportApiService } from '../../../api/statement-import.api.service';
import { StatementReviewDialogComponent } from '../dialogs/statement-review-dialog/statement-review-dialog.component';
import { MainService } from '../main.service';

export const IMPORT_KEY = 'statementImport';
export const IMPORT_COUNT_KEY = 'statementImportCount';

const TOASTR_TITLE = 'Bank statement import';

@Injectable()
export class StatementImportService {
    public expenses: Expense[] = [];

    public constructor(
        private dialogService: NbDialogService,
        private mainService: MainService,
        private statementImportApiService: StatementImportApiService,
        private toastrService: NbToastrService
    ) {
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
        sessionStorage.setItem(IMPORT_KEY, JSON.stringify(expenses));
        sessionStorage.setItem(IMPORT_COUNT_KEY, expenses.length.toString());
    }

    public reloadImportStorage(): void {
        const sessionExpenses = sessionStorage.getItem(IMPORT_KEY);
        if (sessionExpenses !== null) {
            const expenses = JSON.parse(sessionExpenses);
            this.expenses = [];
            for (const expense of expenses) {
                this.expenses.push(plainToInstance(Expense, expense));
            }
        }
    }

    public clearImportStorage(): void {
        sessionStorage.removeItem(IMPORT_KEY);
        sessionStorage.removeItem(IMPORT_COUNT_KEY);
        this.expenses = [];
    }

    public processImport(): void {
        this.dialogService
            .open(StatementReviewDialogComponent, {
                context: {
                    expenses: this.expenses,
                    onSave: (expenses: Expense[]) => {
                        this.updateImportStorage(expenses);
                    },
                },
            })
            .onClose.subscribe(result => {
                /**
                 * trye = queued import
                 * false = canceled import
                 */
                switch (result) {
                    case true:
                        this.toastrService.success('Transactions are being imported, please be patient', TOASTR_TITLE);
                        this.clearImportStorage();
                        break;
                    case false:
                        this.clearImportStorage();
                        break;
                }
            });
    }
}
