import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ConfigInterface } from './interfaces/config.interface';

@Injectable()
export class AppInitializer {
    private http = inject(HttpClient);


    public initializeApp(): Observable<ConfigInterface> {
        return this.http.get(environment.configFile).pipe(
            tap((config: ConfigInterface) => {
                APP_CONFIG.apiUrl = config.apiUrl || '/api';
                APP_CONFIG.locale = config.locale;
                APP_CONFIG.registrationDisabled = config.registrationDisabled;

                import(/* @vite-ignore */ `/ui/assets/l10n/locales/${config.locale}.js`)
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
