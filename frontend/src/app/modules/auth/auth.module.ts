import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {
  NbAuthJWTToken,
  NbAuthModule,
  NbPasswordAuthStrategy
} from '@nebular/auth';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {NbIconModule} from '@nebular/theme';
import {authRoutes} from './auth.routes';

@NgModule({
  declarations: [
  ],
  imports: [
    NbEvaIconsModule,
    NbIconModule,
    RouterModule.forChild(authRoutes)
  ],
})
export class AuthModule {
  public static forRoot(): ModuleWithProviders<NbAuthModule> {
    return NbAuthModule.forRoot({
      forms: {
        login: {
          redirectDelay: 1500,
          strategy: 'email'
        },
        register: {
          redirectDelay: 1500,
          strategy: 'email',
          terms: false
        },
        requestPassword: {
          redirectDelay: 5000,
          strategy: 'email',
        },
        resetPassword: {
          redirectDelay: 5000,
          strategy: 'email',
        },
        logout: {
          strategy: 'email',
        },
        validation: {
          password: {
            minLength: 6,
            maxLength: 255
          },
          fullName: {
            required: true,
            maxLength: 255
          }
        }
      },
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: '/auth/',
          token: {
            key: 'token',
            class: NbAuthJWTToken,
          },
          logout: {
            endpoint: 'logout'
          },
          register: {
            endpoint: 'register'
          },
          requestPass: {
            endpoint: 'password/forgot'
          },
          resetPass: {
            endpoint: 'password/reset',
            resetPasswordTokenKey: 'hash'
          }
        })
      ]
    });
  }
}
