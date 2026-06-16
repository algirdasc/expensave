import { inject, Injectable, signal } from '@angular/core';
import { NbJSThemesRegistry, NbThemeService } from '@nebular/theme';

export type ThemePreference = 'auto' | 'light' | 'dark';
export type AppliedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'expensave.themePreference';
const LIGHT_THEME_NAME = 'expensave';
const DARK_THEME_NAME = 'expensave-dark';

@Injectable({
    providedIn: 'root',
})
export class ThemePreferenceService {
    private readonly preferenceSignal = signal<ThemePreference>('auto');
    private readonly appliedThemeSignal = signal<AppliedTheme>('light');
    private readonly themeService = inject(NbThemeService);
    private readonly jsThemesRegistry = inject(NbJSThemesRegistry);
    private readonly systemDarkModeQuery: MediaQueryList | null = this.getSystemDarkModeQuery();
    private initialized: boolean = false;

    public get preference(): ThemePreference {
        return this.preferenceSignal();
    }

    public get appliedTheme(): AppliedTheme {
        return this.appliedThemeSignal();
    }

    public initialize(): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.registerJsThemeAliases();
        this.preferenceSignal.set(this.loadPreference());
        this.applyCurrentPreference();
        this.listenForSystemThemeChanges();
    }

    public setPreference(preference: ThemePreference): void {
        this.preferenceSignal.set(preference);
        this.storePreference(preference);
        this.applyCurrentPreference();
    }

    public getPreferenceLabel(preference: ThemePreference = this.preference): string {
        switch (preference) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            default:
                return 'Auto';
        }
    }

    public getPreferenceIcon(preference: ThemePreference = this.preference): string {
        switch (preference) {
            case 'light':
                return 'bulb-outline';
            case 'dark':
                return 'moon-outline';
            default:
                return 'monitor-outline';
        }
    }

    private applyCurrentPreference(): void {
        const appliedTheme = this.resolveAppliedTheme(this.preference);

        this.appliedThemeSignal.set(appliedTheme);
        this.themeService.changeTheme(appliedTheme === 'dark' ? DARK_THEME_NAME : LIGHT_THEME_NAME);
    }

    private resolveAppliedTheme(preference: ThemePreference): AppliedTheme {
        if (preference === 'auto') {
            return this.systemDarkModeQuery?.matches ? 'dark' : 'light';
        }

        return preference;
    }

    private listenForSystemThemeChanges(): void {
        if (!this.systemDarkModeQuery) {
            return;
        }

        const listener = (): void => {
            if (this.preference === 'auto') {
                this.applyCurrentPreference();
            }
        };

        if (this.systemDarkModeQuery.addEventListener) {
            this.systemDarkModeQuery.addEventListener('change', listener);
            return;
        }

        this.systemDarkModeQuery.addListener(listener);
    }

    private loadPreference(): ThemePreference {
        const storedPreference = this.getStorage()?.getItem(THEME_STORAGE_KEY);

        if (this.isThemePreference(storedPreference)) {
            return storedPreference;
        }

        return 'auto';
    }

    private storePreference(preference: ThemePreference): void {
        try {
            this.getStorage()?.setItem(THEME_STORAGE_KEY, preference);
        } catch {
            // Ignore blocked storage and keep the in-memory theme for this session.
        }
    }

    private getStorage(): Storage | null {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            return window.localStorage;
        } catch {
            return null;
        }
    }

    private getSystemDarkModeQuery(): MediaQueryList | null {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return null;
        }

        return window.matchMedia('(prefers-color-scheme: dark)');
    }

    private isThemePreference(value: string | null): value is ThemePreference {
        return value === 'auto' || value === 'light' || value === 'dark';
    }

    private registerJsThemeAliases(): void {
        if (!this.jsThemesRegistry.has(LIGHT_THEME_NAME)) {
            this.jsThemesRegistry.register({}, LIGHT_THEME_NAME, 'default');
        }

        if (!this.jsThemesRegistry.has(DARK_THEME_NAME)) {
            this.jsThemesRegistry.register({}, DARK_THEME_NAME, 'dark');
        }
    }
}
