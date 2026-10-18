import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ConfigInterface } from './interfaces/config.interface';
import { LocalePreferenceService } from './services/locale-preference.service';

@Injectable({ providedIn: 'root' })
export class AppInitializer {
    private http = inject(HttpClient);
    private localePreference = inject(LocalePreferenceService);

    public initializeApp(): Observable<ConfigInterface> {
        return this.http.get(environment.configFile).pipe(
            tap((config: ConfigInterface) => {
                APP_CONFIG.apiUrl = config.apiUrl || '/api';
                APP_CONFIG.registrationDisabled = config.registrationDisabled;

                this.localePreference.initialize(config.locale);
                APP_CONFIG.locale = this.localePreference.locale;

                import(/* @vite-ignore */ /* webpackIgnore: true */ `/ui/assets/l10n/locales/${APP_CONFIG.locale}.js`)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then((locale: any) => registerLocaleData(locale.default));
            })
        );
    }

    public getLocaleId(): string {
        return APP_CONFIG.locale ?? 'en';
    }

    public getCurrencyCode(): string {
        return 'EUR';
    }
}

export const APP_CONFIG: ConfigInterface = {
    apiUrl: '',
    locale: '',
    registrationDisabled: false,
};
