import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbUserModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { User } from '../../../../../api/objects/user';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { ProfileDialogComponent } from '../../../dialogs/profile-dialog/profile-dialog.component';

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss'],
    selector: 'app-profile',
    imports: [NbUserModule, NbButtonModule, NbIconModule],
})
export class ProfileComponent {
    private readonly dialogService = inject(NbDialogService);
    private readonly router = inject(Router);

    @Input() public user: User;
    @Output() public userChange: EventEmitter<User> = new EventEmitter<User>();

    public showProfileDialog(): void {
        this.dialogService.open(ProfileDialogComponent, { autoFocus: false }).onClose.subscribe((user: User) => {
            if (user) {
                this.user = user;
                this.userChange.emit(this.user);
            }
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
