import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    NbActionsModule,
    NbAlertModule,
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbDialogRef,
    NbDialogService,
    NbIconModule,
    NbListModule,
    NbSelectModule,
    NbSpinnerModule,
    NbToastrService,
    NbTooltipModule,
    NbUserModule,
} from '@nebular/theme';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { User, UserRole } from '../../../../api/objects/user';
import { UserQueries } from '../../../../queries/user.queries';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    templateUrl: 'admin-users-dialog.component.html',
    styleUrl: 'admin-users-dialog.component.scss',
    imports: [
        FormsModule,
        NbButtonModule,
        NbCardModule,
        NbIconModule,
        NbSelectModule,
        NbSpinnerModule,
        NbTooltipModule,
        NbUserModule,
        NbListModule,
        NbActionsModule,
        NbAlertModule,
        NbBadgeModule,
    ],
})
export class AdminUsersDialogComponent {
    public readonly dialogRef = inject<NbDialogRef<AdminUsersDialogComponent>>(NbDialogRef);
    public currentUser: User;

    protected readonly roles: UserRole[] = ['user', 'admin'];
    protected temporaryPassword: string;
    protected temporaryPasswordUser: User;

    private readonly userQueries = inject(UserQueries);
    private readonly dialogService = inject(NbDialogService);
    private readonly toastrService = inject(NbToastrService);
    private readonly usersQuery = injectQuery(() => this.userQueries.adminProfiles());
    private readonly updateRoleMutation = injectMutation(() => this.userQueries.updateRole());
    private readonly activateMutation = injectMutation(() => this.userQueries.activate());
    private readonly deactivateMutation = injectMutation(() => this.userQueries.deactivate());
    private readonly sendPasswordResetMutation = injectMutation(() => this.userQueries.sendPasswordReset());
    private readonly resetPasswordMutation = injectMutation(() => this.userQueries.resetPassword());

    protected get users(): User[] {
        return this.usersQuery.data() ?? [];
    }

    protected get isBusy(): boolean {
        return (
            this.usersQuery.isFetching() ||
            this.updateRoleMutation.isPending() ||
            this.activateMutation.isPending() ||
            this.deactivateMutation.isPending() ||
            this.sendPasswordResetMutation.isPending() ||
            this.resetPasswordMutation.isPending()
        );
    }

    protected updateRole(user: User, role: UserRole): void {
        if (this.isCurrentUser(user)) {
            return;
        }

        this.updateRoleMutation.mutate(
            { user, role },
            {
                onSuccess: (updatedUser: User) => {
                    user.role = updatedUser.role;
                    this.toastrService.success('User role updated.', 'Users');
                },
            }
        );
    }

    protected activateUser(user: User): void {
        if (this.isCurrentUser(user) || user.active) {
            return;
        }

        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: `Activate ${user.name}?`,
                    yesText: 'Activate',
                },
            })
            .onClose.subscribe((confirmed: boolean) => {
                if (!confirmed) {
                    return;
                }

                this.activateMutation.mutate(user, {
                    onSuccess: (updatedUser: User) => {
                        user.active = updatedUser.active;
                        this.toastrService.success('User activated.', 'Users');
                    },
                });
            });
    }

    protected deactivateUser(user: User): void {
        if (this.isCurrentUser(user) || !user.active) {
            return;
        }

        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: `Deactivate ${user.name}?`,
                    yesText: 'Deactivate',
                },
            })
            .onClose.subscribe((confirmed: boolean) => {
                if (!confirmed) {
                    return;
                }

                this.deactivateMutation.mutate(user, {
                    onSuccess: (updatedUser: User) => {
                        user.active = updatedUser.active;
                        this.clearTemporaryPasswordFor(user);
                        this.toastrService.success('User deactivated.', 'Users');
                    },
                });
            });
    }

    protected sendPasswordReset(user: User): void {
        if (this.isCurrentUser(user) || !user.active) {
            return;
        }

        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: `Send password reset email to ${user.name}?`,
                    yesText: 'Send',
                },
            })
            .onClose.subscribe((confirmed: boolean) => {
                if (!confirmed) {
                    return;
                }

                this.sendPasswordResetMutation.mutate(user, {
                    onSuccess: () => this.toastrService.success('Password reset email sent.', 'Users'),
                });
            });
    }

    protected resetPassword(user: User): void {
        if (this.isCurrentUser(user) || !user.active) {
            return;
        }

        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: `Reset password for ${user.name}?`,
                    yesText: 'Reset',
                },
            })
            .onClose.subscribe((confirmed: boolean) => {
                if (!confirmed) {
                    return;
                }

                this.resetPasswordMutation.mutate(user, {
                    onSuccess: (password: string) => {
                        this.temporaryPassword = password;
                        this.temporaryPasswordUser = user;
                        this.toastrService.success('New password generated.', 'Users');
                    },
                });
            });
    }

    protected isCurrentUser(user: User): boolean {
        return this.currentUser?.id === user.id;
    }

    private clearTemporaryPasswordFor(user: User): void {
        if (this.temporaryPasswordUser?.id !== user.id) {
            return;
        }

        this.temporaryPassword = undefined;
        this.temporaryPasswordUser = undefined;
    }
}
