import { Component, DestroyRef, inject, Input } from '@angular/core';
import {
    NbButtonModule,
    NbContextMenuModule,
    NbIconModule,
    NbMenuItem,
    NbMenuService,
    NbPosition,
    NbTooltipModule,
    NbUserModule,
} from '@nebular/theme';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../../../api/objects/user';
import { ThemePreference, ThemePreferenceService } from '../../../../../services/theme-preference.service';

const THEME_MENU_TAG = 'theme-preference';

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss'],
    selector: 'app-profile',
    imports: [NbUserModule, NbButtonModule, NbIconModule, NbContextMenuModule, NbTooltipModule],
})
export class ProfileComponent {
    @Input() public user: User;

    protected readonly themePreferenceService = inject(ThemePreferenceService);
    protected readonly contextMenuPlacement = NbPosition.BOTTOM_END;
    private readonly menuService = inject(NbMenuService);
    private readonly destroyRef = inject(DestroyRef);

    public constructor() {
        this.menuService
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === THEME_MENU_TAG),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(({ item }) => {
                const preference = item.data;

                if (this.isThemePreference(preference)) {
                    this.themePreferenceService.setPreference(preference);
                }
            });
    }

    protected get themeMenuItems(): NbMenuItem[] {
        const preference = this.themePreferenceService.preference;

        return [
            this.createThemeMenuItem('auto', preference),
            this.createThemeMenuItem('light', preference),
            this.createThemeMenuItem('dark', preference),
        ];
    }

    protected get themeLabel(): string {
        return this.themePreferenceService.getPreferenceLabel();
    }

    protected get themeIcon(): string {
        return this.themePreferenceService.getPreferenceIcon();
    }

    private createThemeMenuItem(preference: ThemePreference, selectedPreference: ThemePreference): NbMenuItem {
        return {
            title: this.themePreferenceService.getPreferenceLabel(preference),
            icon: this.themePreferenceService.getPreferenceIcon(preference),
            selected: preference === selectedPreference,
            data: preference,
        };
    }

    private isThemePreference(value: unknown): value is ThemePreference {
        return value === 'auto' || value === 'light' || value === 'dark';
    }
}
