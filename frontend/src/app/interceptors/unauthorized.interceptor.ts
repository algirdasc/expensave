/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NbTokenService } from '@nebular/auth';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    private router = inject(Router);
    private tokenService = inject(NbTokenService);

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // A 401 from the refresh endpoint means the refresh token itself
                // is invalid/consumed; it is handled by the auth layer, so do not
                // clear tokens here (that caused spurious logouts under the
                // single-use refresh token race on app resume).
                const isRefreshRequest = req.url.includes('/auth/refresh-token');

                if (error.status === 401 && !isRefreshRequest) {
                    this.tokenService.clear();
                    this.router.navigate(['auth/login']);
                }

                return throwError(() => error);
            })
        );
    }
}
