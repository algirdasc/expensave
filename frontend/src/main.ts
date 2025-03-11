import {
    enableProdMode,
    provideAppInitializer,
    inject,
    LOCALE_ID,
    DEFAULT_CURRENCY_CODE,
    importProvidersFrom,
} from '@angular/core';
import { environment } from './environments/environment';
import { AppInitializer } from './app/app.initializer';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthJWTInterceptor } from '@nebular/auth';
import { tokenFilter } from './app/modules/auth/token.filter';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { DateInterceptor } from './app/interceptors/date.interceptor';
import { ApiInterceptor } from './app/interceptors/api.interceptor';
import { UnauthorizedInterceptor } from './app/interceptors/unauthorized.interceptor';
import { AuthStrategy } from './app/modules/auth/auth-strategy';
import { AuthOptionsService } from './app/services/auth-options.service';
import { UserResolver } from './app/resolvers/user.resolver';
import { CalendarResolver } from './app/resolvers/calendar.resolver';
import { SystemCategoryResolver } from './app/resolvers/system-category.resolver';
import { CalendarApiService } from './app/api/calendar.api.service';
import { UserApiService } from './app/api/user.api.service';
import { ExpenseApiService } from './app/api/expense.api.service';
import { CategoryApiService } from './app/api/category.api.service';
import { ReportsApiService } from './app/api/reports.api.service';
import { BalanceUpdateApiService } from './app/api/balance-update.api.service';
import { StatementImportApiService } from './app/api/statement-import.api.service';
import { CommonModule } from '@angular/common';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withRouterConfig, provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import {
    NbThemeModule,
    NbDialogModule,
    NbToastrModule,
    NbDatepickerModule,
    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    NbSpinnerModule,
    NbIconModule,
} from '@nebular/theme';
import { AuthModule } from './app/modules/auth/auth.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppComponent } from './app/app.component';

const apiServices = [
    CalendarApiService,
    UserApiService,
    ExpenseApiService,
    CategoryApiService,
    ReportsApiService,
    BalanceUpdateApiService,
    StatementImportApiService,
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            CommonModule,
            BrowserModule,
            NbThemeModule.forRoot({ name: 'expensave' }),
            AuthModule.forRoot(),
            NbDialogModule.forRoot(),
            NbToastrModule.forRoot(),
            NbDatepickerModule.forRoot(),
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
        { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
        AuthStrategy,
        AuthOptionsService,
        UserResolver,
        CalendarResolver,
        SystemCategoryResolver,
        ...apiServices,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideRouter(appRoutes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    ],
})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((err: any) => console.error('Bootstrap Error:', err));
