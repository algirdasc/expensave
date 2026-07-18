/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthService, NbAuthToken } from '@nebular/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TokenRefreshService } from '../services/token-refresh.service';

/**
 * Drop-in replacement for Nebular's NbAuthJWTInterceptor.
 *
 * Behaves identically (filter public URLs, attach Bearer token, send
 * unauthenticated on refresh failure) but routes the authenticate/refresh
 * check through TokenRefreshService so concurrent refreshes are serialized.
 */
@Injectable()
export class AuthJWTInterceptor implements HttpInterceptor {
    private injector = inject(Injector);
    private filter = inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER);

    // Lazy injection avoids the circular dependency between HTTP_INTERCEPTORS
    // and NbAuthService (same pattern Nebular uses in NbAuthJWTInterceptor).
    private get tokenRefreshService(): TokenRefreshService {
        return this.injector.get(TokenRefreshService);
    }

    private get authService(): NbAuthService {
        return this.injector.get(NbAuthService);
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.filter(req)) {
            return next.handle(req);
        }

        return this.tokenRefreshService.isAuthenticatedOrRefresh().pipe(
            switchMap((authenticated: boolean) => {
                if (!authenticated) {
                    return next.handle(req);
                }

                return this.authService.getToken().pipe(
                    switchMap((token: NbAuthToken) => {
                        const authReq = req.clone({
                            setHeaders: { Authorization: `Bearer ${token.getValue()}` },
                        });

                        return next.handle(authReq);
                    })
                );
            })
        );
    }
}
