import { Component, inject } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogRef,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbSpinnerModule,
    NbToastrService,
    NbTooltipModule,
    NbUserModule,
} from '@nebular/theme';
import { User } from '../../../../api/objects/user';
import { PasswordRequest } from '../../../../api/request/password.request';
import { AuthOptionsService } from '../../../../services/auth-options.service';
import { FormsModule } from '@angular/forms';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { UserQueries } from '../../../../queries/user.queries';

@Component({
    templateUrl: 'profile-dialog.component.html',
    styleUrls: ['profile-dialog.component.scss'],
    imports: [
        FormsModule,
        NbCardModule,
        NbSpinnerModule,
        NbUserModule,
        NbButtonModule,
        NbIconModule,
        NbFormFieldModule,
        NbInputModule,
        NbTooltipModule,
    ],
})
export class ProfileDialogComponent {
    public readonly dialogRef = inject<NbDialogRef<ProfileDialogComponent>>(NbDialogRef);
    public readonly authOptions = inject(AuthOptionsService);
    public passwordRequest: PasswordRequest = new PasswordRequest();
    public readonly passwordMinLength: number = this.authOptions.getConfigValue('forms.validation.password.minLength');
    public readonly passwordMaxLength: number = this.authOptions.getConfigValue('forms.validation.password.maxLength');

    private readonly userQueries = inject(UserQueries);
    private readonly toastrService = inject(NbToastrService);
    private readonly profileQuery = injectQuery(() => this.userQueries.profile());
    private readonly changePasswordMutation = injectMutation(() => this.userQueries.changePassword());

    public get user(): User {
        return this.profileQuery.data() ?? new User();
    }

    public get isBusy(): boolean {
        return this.changePasswordMutation.isPending() || this.profileQuery.isFetching();
    }

    public onSubmit(): void {
        this.changePasswordMutation.mutate(this.passwordRequest, {
            onSuccess: (user: User) => {
                this.toastrService.success('Password changed successfully!', 'Password change');
                this.dialogRef.close(user);
            },
        });
    }
}
