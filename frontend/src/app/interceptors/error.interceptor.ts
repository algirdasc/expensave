import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Error } from '../api/objects/error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private toastrService = inject(NbToastrService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((response: HttpErrorResponse) => {
                if (response.status === 0) {
                    this.toastrService.danger('Unable to connect to Expensave server!', 'Connection error!');
                } else {
                    const error: Error = plainToInstance(Error, response.error as Error, {
                        excludeExtraneousValues: true,
                    });

                    if (!error.throwable) {
                        this.toastrService.danger(response.message, response.statusText);
                    } else {
                        for (const errorMessage of error.messages) {
                            this.toastrService.danger(errorMessage.message, response.statusText);
                        }
                    }
                }

                return throwError(response);
            })
        );
    }
}
