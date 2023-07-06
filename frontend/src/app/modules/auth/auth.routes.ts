import {Routes} from '@angular/router';
import {
  NbAuthComponent,
  NbLoginComponent, NbLogoutComponent, NbRegisterComponent,
  NbRequestPasswordComponent, NbResetPasswordComponent
} from '@nebular/auth';

export const authRoutes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: NbLoginComponent
      },
      {
        path: 'logout',
        component: NbLogoutComponent
      },
      {
        path: 'register',
        component: NbRegisterComponent
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent
      }
    ]
  }
];
