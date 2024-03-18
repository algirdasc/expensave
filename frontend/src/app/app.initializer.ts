import {registerLocaleData} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class AppInitializer {
    constructor(private http: HttpClient) { }

    public initializeApp(): void {
        import(
            /* webpackInclude: /\.mjs$/ */
            /* webpackChunkName: "./assets/l10n/locales/[request]"*/
            `/node_modules/@angular/common/locales/${this.getLocaleId()}.mjs`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((locale: any) => registerLocaleData(locale.default));
    }

    public getLocaleId(): string {
        return environment.locale;
    }

    public getCurrencyCode(): string {
        return environment.currencyCode;
    }
}
