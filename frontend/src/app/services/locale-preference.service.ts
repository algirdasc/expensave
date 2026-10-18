import { Injectable } from '@angular/core';

export interface SupportedLocale {
    id: string;
    label: string;
}

export const LOCALE_STORAGE_KEY = 'expensave.localePreference';

// shortcut: European language locales, a subset of the shipped @angular/common locales; add an entry here to offer more
export const SUPPORTED_LOCALES: SupportedLocale[] = [
    { id: 'sq', label: 'Shqip' },
    { id: 'hy', label: 'Հայերեն' },
    { id: 'az', label: 'Azərbaycan' },
    { id: 'bs', label: 'Bosanski' },
    { id: 'bg', label: 'Български' },
    { id: 'ca', label: 'Català' },
    { id: 'hr', label: 'Hrvatski' },
    { id: 'cs', label: 'Čeština' },
    { id: 'da', label: 'Dansk' },
    { id: 'nl', label: 'Nederlands' },
    { id: 'en', label: 'English' },
    { id: 'en-GB', label: 'English (UK)' },
    { id: 'et', label: 'Eesti' },
    { id: 'fi', label: 'Suomi' },
    { id: 'fr', label: 'Français' },
    { id: 'gl', label: 'Galego' },
    { id: 'ka', label: 'ქართული' },
    { id: 'de', label: 'Deutsch' },
    { id: 'el', label: 'Ελληνικά' },
    { id: 'hu', label: 'Magyar' },
    { id: 'is', label: 'Íslenska' },
    { id: 'ga', label: 'Gaeilge' },
    { id: 'it', label: 'Italiano' },
    { id: 'lv', label: 'Latviešu' },
    { id: 'lt', label: 'Lietuvių' },
    { id: 'lb', label: 'Lëtzebuergesch' },
    { id: 'mk', label: 'Македонски' },
    { id: 'mt', label: 'Malti' },
    { id: 'nb', label: 'Norsk bokmål' },
    { id: 'pl', label: 'Polski' },
    { id: 'pt', label: 'Português' },
    { id: 'ro', label: 'Română' },
    { id: 'sr', label: 'Српски' },
    { id: 'sk', label: 'Slovenčina' },
    { id: 'sl', label: 'Slovenščina' },
    { id: 'es', label: 'Español' },
    { id: 'sv', label: 'Svenska' },
    { id: 'tr', label: 'Türkçe' },
    { id: 'uk', label: 'Українська' },
    { id: 'cy', label: 'Cymraeg' },
];

export function loadStoredLocalePreference(): string | null {
    const storedLocale = getStorage()?.getItem(LOCALE_STORAGE_KEY);

    if (storedLocale && isSupportedLocale(storedLocale)) {
        return storedLocale;
    }

    return null;
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

function isSupportedLocale(value: string): boolean {
    return SUPPORTED_LOCALES.some((locale: SupportedLocale): boolean => locale.id === value);
}

@Injectable({
    providedIn: 'root',
})
export class LocalePreferenceService {
    public readonly locales: SupportedLocale[] = SUPPORTED_LOCALES;

    private effectiveLocale: string = 'en';

    public get locale(): string {
        return this.effectiveLocale;
    }

    public initialize(fallbackLocale: string): void {
        this.effectiveLocale = loadStoredLocalePreference() ?? fallbackLocale;
    }

    public setLocale(locale: string): void {
        if (locale === this.effectiveLocale) {
            return;
        }

        this.effectiveLocale = locale;

        try {
            getStorage()?.setItem(LOCALE_STORAGE_KEY, locale);
        } catch {
            // Ignore blocked storage and keep the in-memory locale for this session.
        }

        // Angular binds LOCALE_ID at bootstrap, so a reload is required to apply the new locale.
        window.location.reload();
    }
}
