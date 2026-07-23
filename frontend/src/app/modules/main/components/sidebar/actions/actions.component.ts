import { Component, inject, Input } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbDialogService, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { environment } from '../../../../../../environments/environment';
import { User } from '../../../../../api/objects/user';
import { CategoriesDialogComponent } from '../../../dialogs/categories-dialog/categories-dialog.component';
import { AdminUsersDialogComponent } from '../../../dialogs/admin-users-dialog/admin-users-dialog.component';
import { ProfileDialogComponent } from '../../../dialogs/profile-dialog/profile-dialog.component';
import { StatementImportService } from '../../../services/statement-import.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-sidebar-actions',
    templateUrl: 'actions.component.html',
    imports: [NbActionsModule, NbTooltipModule, NbButtonModule, NbIconModule],
})
export class ActionsComponent {
    @Input()
    public user: User;

    protected readonly environment = environment;

    private readonly dialogService = inject(NbDialogService);
    private readonly router = inject(Router);
    private readonly statementImportService = inject(StatementImportService);

    protected get hasPendingImport(): boolean {
        return this.statementImportService.draft().length > 0;
    }

    public processImport(): void {
        this.statementImportService.processImport();
    }

    public editCategories(): void {
        this.dialogService.open(CategoriesDialogComponent, {
            context: {
                isSelectable: false,
            },
        });
    }

    public editProfile(): void {
        this.dialogService.open(ProfileDialogComponent, { autoFocus: false });
    }

    public manageUsers(): void {
        this.dialogService.open(AdminUsersDialogComponent, {
            autoFocus: false,
            context: {
                currentUser: this.user,
            },
        });
    }

    public showLogoutConfirmDialog(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: 'Are you sure you want to logout?',
                },
            })
            .onClose.subscribe((result: boolean) => {
                if (result) {
                    this.router.navigate(['/auth/logout']);
                }
            });
    }
}
