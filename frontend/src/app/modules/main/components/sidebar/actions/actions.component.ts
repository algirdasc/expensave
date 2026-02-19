import { Component, inject } from '@angular/core';
import { NbActionsModule, NbDialogService, NbTooltipModule } from '@nebular/theme';
import { environment } from '../../../../../../environments/environment';
import { CategoriesDialogComponent } from '../../../dialogs/categories-dialog/categories-dialog.component';
import { StatementImportService } from '../../../services/statement-import.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sidebar-actions',
    templateUrl: 'actions.component.html',
    styleUrl: 'actions.component.scss',
    imports: [NbActionsModule, RouterLink, NbTooltipModule],
})
export class ActionsComponent {
    private dialogService = inject(NbDialogService);
    protected statementImportService = inject(StatementImportService);

    protected readonly environment = environment;

    public editCategories(): void {
        this.dialogService.open(CategoriesDialogComponent, {
            context: {
                isSelectable: false,
            },
        });
    }
}
