import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { environment } from '../../../../../../environments/environment';
import { CategoriesDialogComponent } from '../../../dialogs/categories-dialog/categories-dialog.component';
import { StatementImportService } from '../../../modules/statement-import/statement-import.service';

@Component({
    selector: 'app-sidebar-actions',
    templateUrl: 'actions.component.html',
    styleUrl: 'actions.component.scss',
})
export class ActionsComponent {
    protected readonly environment = environment;

    public constructor(
        private dialogService: NbDialogService,
        protected statementImportService: StatementImportService
    ) {}

    public editCategories(): void {
        this.dialogService.open(CategoriesDialogComponent, {
            context: {
                isSelectable: false,
            },
        });
    }
}
