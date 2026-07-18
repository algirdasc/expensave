import { inject, Injectable } from '@angular/core';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap } from 'rxjs/operators';

/**
 * Serializes concurrent token refresh calls into a single HTTP request.
 *
 * The backend issues single-use refresh tokens, so firing several refresh
 * requests in parallel (e.g. when the PWA resumes from background and multiple
 * API calls detect the expired access token at once) makes all but the first
 * fail with 401 and log the user out. This service ensures only one refresh is
 * in flight at a time; all callers share its result.
 */
@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
    private authService = inject(NbAuthService);
    private refreshInFlight$: Observable<boolean> | null = null;

    public isAuthenticatedOrRefresh(): Observable<boolean> {
        return this.authService.getToken().pipe(
            switchMap((token: NbAuthToken) => {
                if (token.getValue() && !token.isValid()) {
                    return this.refreshWithDedup(token);
                }

                return of(token.isValid());
            })
        );
    }

    private refreshWithDedup(token: NbAuthToken): Observable<boolean> {
        if (!this.refreshInFlight$) {
            this.refreshInFlight$ = this.authService.refreshToken(token.getOwnerStrategyName(), token).pipe(
                map((result) => result.isSuccess()),
                catchError(() => of(false)),
                finalize(() => {
                    this.refreshInFlight$ = null;
                }),
                shareReplay(1)
            );
        }

        return this.refreshInFlight$;
    }
}
