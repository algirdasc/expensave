import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NbDialogService} from '@nebular/theme';
import {User} from '../../../../api/entities/user.entity';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {ProfileDialogComponent} from '../../dialogs/profile-dialog/profile-dialog.component';

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss'],
    selector: 'app-profile',
})
export class ProfileComponent {
    @Input() public user: User;
    @Output() public userChange: EventEmitter<User> = new EventEmitter<User>();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly dialogService: NbDialogService,
        private readonly router: Router
    ) { }

    public showProfileDialog(): void {
        this.dialogService
            .open(ProfileDialogComponent, { autoFocus: false })
            .onClose
            .subscribe((user: User) => {
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
                    question: 'Are you sure you want to logout?'
                }
            })
            .onClose
            .subscribe((result: boolean) => {
                if (result) {
                    this.router.navigate(['/auth/logout']);
                }
            });
    }
}