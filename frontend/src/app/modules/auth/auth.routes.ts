import { Routes } from '@angular/router';
import {
    NbAuthComponent,
    NbLogoutComponent,
    NbRegisterComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
} from '@nebular/auth';
import { LoginComponent } from './components/login/login.component';

export const authRoutes: Routes = [
    {
        path: '',
        component: NbAuthComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            {
                path: 'register',
                component: NbRegisterComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            },
        ],
    },
];
