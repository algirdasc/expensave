import {HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
    NbAuthResult,
    NbAuthStrategyClass,
    NbAuthToken,
    NbPasswordAuthStrategy,
    NbPasswordAuthStrategyOptions,
    passwordStrategyOptions
} from '@nebular/auth';
import {NbAuthRefreshableToken} from '@nebular/auth/services/token/token';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

type AuthRefreshToken = NbAuthRefreshableToken & NbAuthToken;

@Injectable()
export class AuthStrategy extends NbPasswordAuthStrategy {
    protected defaultOptions: NbPasswordAuthStrategyOptions = passwordStrategyOptions;

    public refreshToken(token: AuthRefreshToken): Observable<NbAuthResult> {
        const module = 'refreshToken';
        const url = this.getActionEndpoint(module);
        const requireValidToken = this.getOption(`${module}.requireValidToken`);

        return this.http
            .post(url, { refreshToken: token.getRefreshToken() }, { headers: this.getHeaders() })
            .pipe(
                map((response: HttpResponse<{ token: string; refreshToken: string }>) => {
                    return new NbAuthResult(
                        true,
                        response,
                        this.getOption('redirect.success'),
                        [],
                        this.getOption('defaultMessages'),
                        this.createRefreshedToken(response, token, requireValidToken),
                    );
                }),
                catchError((error: Error) => this.handleResponseError(error, module)),
            );
    }

    private createRefreshedToken(
        response: HttpResponse<{ token: string; refreshToken: string }>,
        existingToken: NbAuthRefreshableToken,
        requireValidToken: boolean
    ): NbAuthToken {
        const refreshedToken: AuthRefreshToken = this.createToken<AuthRefreshToken>(response, requireValidToken);
        if (!refreshedToken.getRefreshToken() && existingToken.getRefreshToken()) {
            refreshedToken.setRefreshToken(existingToken.getRefreshToken());
        }

        return refreshedToken;
    }

    public static setup(options: NbPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbPasswordAuthStrategyOptions] {
        return [AuthStrategy, options];
    }
}
