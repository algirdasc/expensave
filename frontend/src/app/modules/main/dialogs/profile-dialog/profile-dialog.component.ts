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
    NbUserModule,
} from '@nebular/theme';
import { User } from '../../../../api/objects/user';
import { PasswordRequest } from '../../../../api/request/password.request';
import { UserApiService } from '../../../../api/user.api.service';
import { AuthOptionsService } from '../../../../services/auth-options.service';
import { FormsModule } from '@angular/forms';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { UserQueries } from '../../../../queries/user.queries';
import { finalize } from 'rxjs/operators';
import { QueryKeys } from '../../../../queries/query-keys';

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
    ],
})
export class ProfileDialogComponent {
    public readonly dialogRef = inject<NbDialogRef<ProfileDialogComponent>>(NbDialogRef);
    public readonly authOptions = inject(AuthOptionsService);
    public passwordRequest: PasswordRequest = new PasswordRequest();
    public readonly passwordMinLength: number = this.authOptions.getConfigValue('forms.validation.password.minLength');
    public readonly passwordMaxLength: number = this.authOptions.getConfigValue('forms.validation.password.maxLength');

    private readonly userApiService = inject(UserApiService);
    private readonly userQueries = inject(UserQueries);
    private readonly queryClient = inject(QueryClient);
    private readonly toastrService = inject(NbToastrService);
    private readonly profileQuery = injectQuery(() => this.userQueries.profile());
    private isChangingPassword = false;

    public get user(): User {
        return this.profileQuery.data() ?? new User();
    }

    public get isBusy(): boolean {
        return this.isChangingPassword || this.profileQuery.isFetching();
    }

    public onSubmit(): void {
        this.isChangingPassword = true;
        this.userApiService
            .changePassword(this.passwordRequest)
            .pipe(finalize(() => (this.isChangingPassword = false)))
            .subscribe((user: User) => {
                this.queryClient.setQueryData(QueryKeys.user.profile, user);
                this.toastrService.success('Password changed successfully!', 'Password change');
                this.dialogRef.close(user);
            });
    }
}
