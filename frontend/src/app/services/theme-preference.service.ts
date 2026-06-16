import { inject, Injectable, signal } from '@angular/core';
import { NbJSThemesRegistry, NbThemeService } from '@nebular/theme';

export type ThemePreference = 'auto' | 'light' | 'dark';
export type AppliedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'expensave.themePreference';
export const LIGHT_THEME_NAME = 'expensave';
export const DARK_THEME_NAME = 'expensave-dark';
export const THEME_JS_THEMES = [
    { name: LIGHT_THEME_NAME, base: 'default' },
    { name: DARK_THEME_NAME, base: 'dark' },
];
const THEME_PREFERENCE_SEQUENCE: ThemePreference[] = ['auto', 'light', 'dark'];

export function resolveInitialThemeName(): string {
    const preference = loadStoredThemePreference();

    if (preference === 'dark') {
        return DARK_THEME_NAME;
    }

    if (preference === 'auto' && getSystemDarkModeQuery()?.matches) {
        return DARK_THEME_NAME;
    }

    return LIGHT_THEME_NAME;
}

function loadStoredThemePreference(): ThemePreference {
    const storedPreference = getStorage()?.getItem(THEME_STORAGE_KEY);

    if (isThemePreference(storedPreference)) {
        return storedPreference;
    }

    return 'auto';
}

function getStorage(): Storage | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

function getSystemDarkModeQuery(): MediaQueryList | null {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
}

function isThemePreference(value: string | null): value is ThemePreference {
    return value === 'auto' || value === 'light' || value === 'dark';
}

@Injectable({
    providedIn: 'root',
})
export class ThemePreferenceService {
    private readonly preferenceSignal = signal<ThemePreference>('auto');
    private readonly appliedThemeSignal = signal<AppliedTheme>('light');
    private readonly themeService = inject(NbThemeService);
    private readonly jsThemesRegistry = inject(NbJSThemesRegistry);
    private readonly systemDarkModeQuery: MediaQueryList | null = getSystemDarkModeQuery();
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
        this.preferenceSignal.set(loadStoredThemePreference());
        this.applyCurrentPreference();
        this.listenForSystemThemeChanges();
    }

    public setPreference(preference: ThemePreference): void {
        this.preferenceSignal.set(preference);
        this.storePreference(preference);
        this.applyCurrentPreference();
    }

    public cyclePreference(): void {
        const currentIndex = THEME_PREFERENCE_SEQUENCE.indexOf(this.preference);
        const nextIndex = currentIndex === THEME_PREFERENCE_SEQUENCE.length - 1 ? 0 : currentIndex + 1;

        this.setPreference(THEME_PREFERENCE_SEQUENCE[nextIndex]);
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
                return 'sun-outline';
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

    private storePreference(preference: ThemePreference): void {
        try {
            getStorage()?.setItem(THEME_STORAGE_KEY, preference);
        } catch {
            // Ignore blocked storage and keep the in-memory theme for this session.
        }
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
