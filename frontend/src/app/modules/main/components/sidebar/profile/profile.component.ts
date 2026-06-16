import { Component, inject, Input } from '@angular/core';
import { NbButtonModule, NbIconModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { User } from '../../../../../api/objects/user';
import { ThemePreferenceService } from '../../../../../services/theme-preference.service';

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss'],
    selector: 'app-profile',
    imports: [NbUserModule, NbButtonModule, NbIconModule, NbTooltipModule],
})
export class ProfileComponent {
    @Input() public user: User;

    protected readonly themePreferenceService = inject(ThemePreferenceService);

    protected get themeLabel(): string {
        return this.themePreferenceService.getPreferenceLabel();
    }

    protected get themeIcon(): string {
        return this.themePreferenceService.getPreferenceIcon();
    }

    protected onThemePreferenceClick(): void {
        this.themePreferenceService.cyclePreference();
    }
}
