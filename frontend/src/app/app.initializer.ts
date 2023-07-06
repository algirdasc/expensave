import {registerLocaleData} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ConfigInterface} from './interfaces/config.interface';

@Injectable()
export class AppInitializer {
    constructor(private http: HttpClient) { }

    public initializeApp(): Observable<ConfigInterface> {
        return this.http
            .get('/assets/config.json')
            .pipe(
                tap((config: ConfigInterface) => {
                    APP_CONFIG.locale = config.locale;
                    APP_CONFIG.apiUrl = config.apiUrl;

                    import(`/node_modules/@angular/common/locales/${config.locale}.mjs`)
                        .then((locale: any) => registerLocaleData(locale.default));
                })
            );
    }

    public getLocaleId(): string {
        return APP_CONFIG.locale;
    }
}

export const APP_CONFIG: ConfigInterface = {
    apiUrl: '',
    locale: ''
};
