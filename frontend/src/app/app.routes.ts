import {Routes} from '@angular/router';
import {canActivateAuthenticated} from './modules/auth/auth.functions';
import {Error404Component} from './modules/error-404.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/calendar',
        pathMatch: 'full',
    },
    {
        path: 'calendar',
        canActivate: [canActivateAuthenticated],
        loadChildren: () => import('./modules/main/main.module')
            .then(m => m.MainModule)
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
