import {
    DEFAULT_CURRENCY_CODE,
    enableProdMode,
    importProvidersFrom,
    inject,
    LOCALE_ID,
    provideAppInitializer,
} from '@angular/core';
import { MainService } from './app/modules/main/main.service';
import { environment } from './environments/environment';
import { AppInitializer } from './app/app.initializer';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { tokenFilter } from './app/modules/auth/token.filter';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { DateInterceptor } from './app/interceptors/date.interceptor';
import { ApiInterceptor } from './app/interceptors/api.interceptor';
import { UnauthorizedInterceptor } from './app/interceptors/unauthorized.interceptor';
import { AuthJWTInterceptor } from './app/interceptors/auth-jwt.interceptor';
import { AppResumeService } from './app/services/app-resume.service';
import { AuthStrategy } from './app/modules/auth/auth-strategy';
import { AuthOptionsService } from './app/services/auth-options.service';
import { CommonModule } from '@angular/common';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { appRoutes } from './app/app.routes';
import {
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbDialogModule,
    NbIconModule,
    NbLayoutModule,
    NbSidebarModule,
    NbSpinnerModule,
    NbThemeModule,
    NbToastrModule,
} from '@nebular/theme';
import { AuthModule } from './app/modules/auth/auth.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppComponent } from './app/app.component';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools';
import {
    resolveInitialThemeName,
    THEME_JS_THEMES,
    ThemePreferenceService,
} from './app/services/theme-preference.service';

const queryClient = new QueryClient();

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideTanStackQuery(queryClient, withDevtools()),
        importProvidersFrom(
            CommonModule,
            BrowserModule,
            NbThemeModule.forRoot({ name: resolveInitialThemeName() }, THEME_JS_THEMES),
            AuthModule.forRoot(),
            NbDialogModule.forRoot(),
            NbToastrModule.forRoot(),
            NbDatepickerModule.forRoot(),
            NbSidebarModule.forRoot(),
            NbLayoutModule,
            NbCardModule,
            NbButtonModule,
            NbSpinnerModule,
            NbEvaIconsModule,
            NbIconModule
        ),
        AppInitializer,
        provideAppInitializer(() => {
            const initializerFn = (
                (appInitializer: AppInitializer): (() => void) =>
                () =>
                    appInitializer.initializeApp()
            )(inject(AppInitializer));
            return initializerFn();
        }),
        provideAppInitializer(() => {
            inject(ThemePreferenceService).initialize();
        }),
        provideAppInitializer(() => {
            inject(AppResumeService).initialize();
        }),
        {
            provide: LOCALE_ID,
            useFactory: (appInitializer: AppInitializer): string => appInitializer.getLocaleId(),
            deps: [AppInitializer],
        },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useFactory: (appInitializer: AppInitializer): string => appInitializer.getCurrencyCode(),
            deps: [AppInitializer],
        },
        { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: tokenFilter },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthJWTInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
        AuthStrategy,
        AuthOptionsService,
        MainService, // TODO: move to global service and scope out functions
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideRouter(appRoutes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    ],
})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((err: any) => console.error('Bootstrap Error:', err));
