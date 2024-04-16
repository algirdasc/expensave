import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthJWTInterceptor} from '@nebular/auth';
import {
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbDialogModule,
    NbLayoutModule,
    NbSpinnerModule,
    NbThemeModule,
    NbToastrModule
} from '@nebular/theme';
import 'reflect-metadata';
import {CalendarApiService} from './api/calendar.api.service';
import {CategoryApiService} from './api/category.api.service';
import {ExpenseApiService} from './api/expense.api.service';
import {UserApiService} from './api/user.api.service';
import {AppComponent} from './app.component';
import {AppInitializer} from './app.initializer';
import {appRoutes} from './app.routes';
import {ApiInterceptor} from './interceptors/api.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {UnauthorizedInterceptor} from './interceptors/unauthorized.interceptor';
import {AuthStrategy} from './modules/auth/auth-strategy';
import {AuthModule} from './modules/auth/auth.module';
import {tokenFilter} from './modules/auth/token.filter';
import {Error404Component} from './modules/error-404.component';
import {AuthOptionsService} from './services/auth-options.service';

const apiServices = [
    CalendarApiService,
    UserApiService,
    ExpenseApiService,
    CategoryApiService,
];

@NgModule({
    declarations: [
        AppComponent,
        Error404Component,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { paramsInheritanceStrategy: 'always' }),
        NbThemeModule.forRoot({ name: 'expensave' }),
        AuthModule.forRoot(),
        NbDialogModule.forRoot(),
        NbToastrModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbLayoutModule,
        NbCardModule,
        NbButtonModule,
        NbSpinnerModule,
    ],
    providers: [
        AppInitializer,
        {
            provide: APP_INITIALIZER,
            useFactory: (appInitializer: AppInitializer) => () => appInitializer.initializeApp(),
            deps: [AppInitializer],
            multi: true
        },
        {
            provide: LOCALE_ID,
            useFactory: (appInitializer: AppInitializer) => appInitializer.getLocaleId(),
            deps: [AppInitializer]
        },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useFactory: (appInitializer: AppInitializer) => appInitializer.getCurrencyCode(),
            deps: [AppInitializer]
        },
        { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: tokenFilter },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
        AuthStrategy,
        AuthOptionsService,
        ...apiServices
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
