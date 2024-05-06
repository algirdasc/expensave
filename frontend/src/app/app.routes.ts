import {Routes} from '@angular/router';
import {canActivateAuthenticated} from './modules/auth/auth.functions';
import {Error404Component} from './modules/error-404.component';
import {CalendarResolver} from './resolvers/calendar.resolver';
import {UserResolver} from './resolvers/user.resolver';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/calendar',
        pathMatch: 'full',
    },
    {
        path: 'calendar',
        canActivate: [canActivateAuthenticated],
        resolve: {
            user: UserResolver,
            calendars: CalendarResolver,
        },
        loadChildren: () => import('./modules/main/main.module')
            .then(m => m.MainModule)
    },
    {
        path: 'reports',
        canActivate: [canActivateAuthenticated],
        resolve: {
            user: UserResolver,
            calendars: CalendarResolver,
        },
        loadChildren: () => import('./modules/reports/reports.module')
            .then(m => m.ReportsModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module')
            .then(m => m.AuthModule)
    },
    {
        path: '**',
        component: Error404Component
    }
];
