import { Component, OnInit } from '@angular/core';
import {
    NbDialogRef,
    NbToastrService,
    NbCardModule,
    NbSpinnerModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbFormFieldModule,
    NbInputModule,
} from '@nebular/theme';
import { User } from '../../../../api/objects/user';
import { PasswordRequest } from '../../../../api/request/password.request';
import { UserApiService } from '../../../../api/user.api.service';
import { AuthOptionsService } from '../../../../services/auth-options.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

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
        NgIf,
    ],
})
export class ProfileDialogComponent implements OnInit {
    public user: User = new User();
    public isBusy: boolean = true;
    public passwordRequest: PasswordRequest = new PasswordRequest();

    public constructor(
        public readonly dialogRef: NbDialogRef<ProfileDialogComponent>,
        private readonly userApiService: UserApiService,
        private readonly toastrService: NbToastrService,
        public authOptions: AuthOptionsService
    ) {
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
