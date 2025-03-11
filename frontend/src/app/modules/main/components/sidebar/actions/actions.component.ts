import { Component } from '@angular/core';
import { NbDialogService, NbActionsModule, NbTooltipModule } from '@nebular/theme';
import { environment } from '../../../../../../environments/environment';
import { CategoriesDialogComponent } from '../../../dialogs/categories-dialog/categories-dialog.component';
import { StatementImportService } from '../../../services/statement-import.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-sidebar-actions',
    templateUrl: 'actions.component.html',
    styleUrl: 'actions.component.scss',
    imports: [NbActionsModule, RouterLink, NbTooltipModule, NgIf],
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
