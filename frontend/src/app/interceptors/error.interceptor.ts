import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import {plainToInstance} from 'class-transformer';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Error} from '../api/entities/error.entity';

const REQUEST_VALIDATION_EXCEPTION: string = 'App\\Exception\\RequestValidationException';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private toastrService: NbToastrService
    ) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(req)
            .pipe(
                catchError((response: HttpErrorResponse) => {
                    const error: Error = plainToInstance(
                        Error,
                        response.error as Error,
                        { excludeExtraneousValues: true }
                    );

                    if (error.throwable && error.throwable !== REQUEST_VALIDATION_EXCEPTION) {
                        for (const errorMessage of error.messages) {
                            this.toastrService.danger(errorMessage.message, response.statusText);
                        }
                    } else {
                        this.toastrService.danger(response.message, response.statusText);
                    }

                    return throwError(response);
                })
            );
    }
}
