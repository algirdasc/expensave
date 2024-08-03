import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { StatementReviewDialogComponent } from '../../dialogs/statement-review-dialog/statement-review-dialog.component';

export const IMPORT_KEY = 'statementImport';
export const IMPORT_COUNT_KEY = 'statementImportCount';

@Injectable()
export class StatementImportService {
    public constructor(private dialogService: NbDialogService) {}

    public processImport(): void {
        console.log(sessionStorage.getItem('emptykey'));
        const expenses = JSON.parse(sessionStorage.getItem(IMPORT_KEY));

        this.dialogService.open(StatementReviewDialogComponent, {
            context: {
                expenses: expenses,
            },
        });
    }
}
