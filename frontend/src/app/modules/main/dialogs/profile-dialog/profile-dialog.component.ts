import {Component, OnInit} from '@angular/core';
import {User} from '../../../../api/entities/user.entity';
import {UserApiService} from '../../../../api/user.api.service';
import {NbDialogRef} from '@nebular/theme';

@Component({
    templateUrl: 'profile-dialog.component.html',
    styleUrls: ['profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
    public user: User = new User();
    public isBusy: boolean = false;

    constructor(
        private readonly userApiService: UserApiService,
        private readonly dialogRef: NbDialogRef<ProfileDialogComponent>
    ) {
        this.userApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngOnInit(): void {
        this.userApiService
            .profile()
            .subscribe((user: User) => this.user = user)
        ;
    }

    public onSubmit(): void {
        this.userApiService
            .save(this.user)
            .subscribe((user: User) => this.dialogRef.close(user))
        ;
    }

    public onAvatarSelected(event): void {
        // TODO
    }
}
