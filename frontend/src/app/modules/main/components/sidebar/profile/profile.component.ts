import { Component, Input } from '@angular/core';
import { NbButtonModule, NbIconModule, NbUserModule } from '@nebular/theme';
import { User } from '../../../../../api/objects/user';

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss'],
    selector: 'app-profile',
    imports: [NbUserModule, NbButtonModule, NbIconModule],
})
export class ProfileComponent {
    @Input() public user: User;
}
