import { Provider, ValueProvider } from '@angular/core';
import { NB_AUTH_USER_OPTIONS } from '@nebular/auth';
import { AuthModule } from './auth.module';

interface AuthUserOptions {
    forms: {
        resetPassword: {
            redirectDelay: number;
        };
    };
    strategies: Array<
        [
            unknown,
            {
                resetPass: {
                    resetPasswordTokenKey: string;
                    redirect: {
                        success: string;
                    };
                };
            },
        ]
    >;
}

describe('AuthModule', () => {
    it('redirects to login after a successful password reset', (): void => {
        const options = authOptions();
        const strategyOptions = options.strategies[0][1];

        expect(strategyOptions.resetPass.resetPasswordTokenKey).toBe('hash');
        expect(strategyOptions.resetPass.redirect.success).toBe('/auth/login');
        expect(options.forms.resetPassword.redirectDelay).toBe(1500);
    });
});

const authOptions = (): AuthUserOptions => {
    const provider = AuthModule.forRoot().providers?.find(isAuthUserOptionsProvider);

    if (!provider) {
        throw new Error('Nebular auth user options provider was not registered.');
    }

    return provider.useValue;
};

const isAuthUserOptionsProvider = (provider: Provider): provider is ValueProvider & { useValue: AuthUserOptions } => {
    return (
        typeof provider === 'object' &&
        provider !== null &&
        'provide' in provider &&
        provider.provide === NB_AUTH_USER_OPTIONS &&
        'useValue' in provider
    );
};
