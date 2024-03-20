import {HttpResponse} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NbAuthModule} from '@nebular/auth';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {NbIconModule} from '@nebular/theme';
import {AuthStrategy} from './auth-strategy';
import {authRoutes} from './auth.routes';
import {JwtRefreshableToken} from './jwt-refreshable-token';

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
                    rememberMe: false,
                    strategy: 'jwt'
                },
                register: {
                    redirectDelay: 1500,
                    strategy: 'jwt',
                    terms: false
                },
                requestPassword: {
                    redirectDelay: 5000,
                    strategy: 'jwt',
                },
                resetPassword: {
                    redirectDelay: 5000,
                    strategy: 'jwt',
                },
                logout: {
                    strategy: 'jwt',
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
                AuthStrategy.setup({
                    name: 'jwt',
                    baseEndpoint: '/auth/',
                    token: {
                        class: JwtRefreshableToken,
                        getter: (
                            module: string,
                            response: HttpResponse<{ token: string; refreshToken: string }>,
                        ) => {
                            return response.body;
                        }
                    },
                    refreshToken: {
                        requireValidToken: true,
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
