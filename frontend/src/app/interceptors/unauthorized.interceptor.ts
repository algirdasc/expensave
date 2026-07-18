/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbTokenService } from '@nebular/auth';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tokenFilter } from '../modules/auth/token.filter';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    private router = inject(Router);
    private tokenService = inject(NbTokenService);

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // A 401 from a public auth endpoint (login, refresh-token) is not a
                // session expiry - it means the submitted credentials or refresh
                // token were rejected. The auth layer handles those (login form
                // error message; refresh race on resume), so do not clear tokens
                // or redirect here.
                const isPublicAuthRequest = tokenFilter(req);

                if (error.status === 401 && !isPublicAuthRequest) {
                    this.tokenService.clear();
                    this.router.navigate(['auth/login']);
                }

                return throwError(() => error);
            })
        );
    }
}
