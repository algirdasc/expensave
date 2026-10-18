import { LOCALE_STORAGE_KEY, LocalePreferenceService, loadStoredLocalePreference } from './locale-preference.service';

describe('LocalePreferenceService', () => {
    let service: LocalePreferenceService;

    beforeEach((): void => {
        window.localStorage.removeItem(LOCALE_STORAGE_KEY);
        service = new LocalePreferenceService();
    });

    afterEach((): void => {
        window.localStorage.removeItem(LOCALE_STORAGE_KEY);
    });

    it('falls back to the config locale when nothing is stored', (): void => {
        service.initialize('de');

        expect(service.locale).toBe('de');
    });

    it('prefers a stored supported locale over the config locale', (): void => {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');

        service.initialize('de');

        expect(service.locale).toBe('fr');
        expect(loadStoredLocalePreference()).toBe('fr');
    });

    it('ignores a stored locale that is not supported', (): void => {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, 'klingon');

        service.initialize('de');

        expect(service.locale).toBe('de');
        expect(loadStoredLocalePreference()).toBeNull();
    });
});
