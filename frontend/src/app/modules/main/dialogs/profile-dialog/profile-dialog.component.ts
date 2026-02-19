import { Component, inject, OnInit } from '@angular/core';
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
export class ProfileDialogComponent implements OnInit {
    public readonly dialogRef = inject<NbDialogRef<ProfileDialogComponent>>(NbDialogRef);
    private readonly userApiService = inject(UserApiService);
    private readonly toastrService = inject(NbToastrService);
    public readonly authOptions = inject(AuthOptionsService);

    public user: User = new User();
    public isBusy: boolean = true;
    public passwordRequest: PasswordRequest = new PasswordRequest();

    public constructor() {
        this.userApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public ngOnInit(): void {
        this.userApiService.profile().subscribe((user: User) => (this.user = user));
    }

    public onSubmit(): void {
        this.userApiService.changePassword(this.passwordRequest).subscribe((user: User) => {
            this.toastrService.success('Password changed successfully!', 'Password change');
            this.dialogRef.close(user);
        });
    }
}
