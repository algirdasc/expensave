import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NbTokenService} from '@nebular/auth';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    constructor(private router: Router, private tokenService: NbTokenService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.tokenService.clear();
                        this.router.navigate(['auth/login']);
                    }

                    return throwError(error);
                })
            );
    }
}
