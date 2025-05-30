import { Component, Input } from '@angular/core';
import { User } from '../../../../../../api/objects/user';
import { NbListModule, NbUserModule } from '@nebular/theme';

@Component({
    selector: 'app-expense-dialog-user-list-item',
    template: `<nb-list-item class="border-0">
        <nb-user [picture]="user.avatar" onlyPicture size="tiny" class="me-2"></nb-user>
        <div class="text-truncate text-hint">{{ user.name }}</div>
    </nb-list-item>`,
    imports: [NbListModule, NbUserModule],
})
export class UserListItemComponent {
    @Input({ required: true })
    public user: User;
}
