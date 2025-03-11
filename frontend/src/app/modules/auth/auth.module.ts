import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbAuthModule } from '@nebular/auth';
import {
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
} from '@nebular/theme';
import { AuthStrategy } from './auth-strategy';
import { authRoutes } from './auth.routes';
import { LoginComponent } from './components/login/login.component';
import { JwtRefreshableToken } from './jwt-refreshable-token';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NbLayoutModule,
        NbCardModule,
        NbAlertModule,
        NbInputModule,
        NbButtonModule,
        NbIconModule,
        NbCheckboxModule,
        RouterModule.forChild(authRoutes),
        NgOptimizedImage,
        LoginComponent,
    ],
})
export class AuthModule {
    public static forRoot(): ModuleWithProviders<NbAuthModule> {
        return NbAuthModule.forRoot({
            forms: {
                login: {
                    redirectDelay: 1500,
                    rememberMe: false,
                    strategy: 'jwt',
                    showMessages: {
                        error: false,
                    },
                },
                register: {
                    redirectDelay: 1500,
                    strategy: 'jwt',
                    terms: false,
                    showMessages: {
                        error: false,
                    },
                },
                requestPassword: {
                    redirectDelay: 5000,
                    strategy: 'jwt',
                    showMessages: {
                        error: false,
                    },
                },
                resetPassword: {
                    redirectDelay: 5000,
                    strategy: 'jwt',
                    showMessages: {
                        error: false,
                    },
                },
                logout: {
                    strategy: 'jwt',
                },
                validation: {
                    password: {
                        minLength: 6,
                        maxLength: 255,
                    },
                    fullName: {
                        required: true,
                        maxLength: 255,
                    },
                },
            },
            strategies: [
                AuthStrategy.setup({
                    name: 'jwt',
                    baseEndpoint: '/auth/',
                    token: {
                        class: JwtRefreshableToken,
                        getter: (module: string, response: HttpResponse<{ token: string; refreshToken: string }>) => {
                            return response.body;
                        },
                    },
                    refreshToken: {
                        requireValidToken: true,
                    },
                    logout: {
                        endpoint: 'logout',
                    },
                    register: {
                        endpoint: 'register',
                    },
                    requestPass: {
                        endpoint: 'password/forgot',
                    },
                    resetPass: {
                        endpoint: 'password/reset',
                        resetPasswordTokenKey: 'hash',
                    },
                }),
            ],
        });
    }
}
