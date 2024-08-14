import { Injectable } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { Expense } from '../../../../api/objects/expense';
import { StatementImportResponse } from '../../../../api/response/statement-import.response';
import { StatementImportApiService } from '../../../../api/statement-import.api.service';
import { StatementReviewDialogComponent } from '../../dialogs/statement-review-dialog/statement-review-dialog.component';
import { MainService } from '../../main.service';

export const IMPORT_KEY = 'statementImport';
export const IMPORT_COUNT_KEY = 'statementImportCount';

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
            mainService.isApplicationBusy.next(isBusy)
        );

        const sessionExpenses = sessionStorage.getItem(IMPORT_KEY);
        if (sessionExpenses !== null) {
            this.expenses = JSON.parse(sessionStorage.getItem(IMPORT_KEY));
        }
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
            this.statementImportApiService.import(calendar, formData).subscribe((response: StatementImportResponse) => {
                if (response.expenses.length === 0) {
                    return this.toastrService.warning(
                        'Statement file does not contain any transactions. Want to select another one?',
                        'Bank statement import'
                    );
                }

                sessionStorage.setItem(IMPORT_KEY, JSON.stringify(response.expenses));
                sessionStorage.setItem(IMPORT_COUNT_KEY, response.expenses.length.toString());

                this.processImport();
            });
        };

        document.body.appendChild(fileInput);
        fileInput.click();
    }

    public processImport(): void {
        this.dialogService
            .open(StatementReviewDialogComponent, {
                context: {
                    expenses: this.expenses,
                },
            })
            .onClose.subscribe(result => {
                /**
                 * false = cancel
                 * null = close
                 * true = success!
                 */
                if (result === false) {
                    this.cancelImport();
                }
            });
    }

    public cancelImport(): void {
        sessionStorage.removeItem(IMPORT_KEY);
        this.expenses = [];
    }
}
