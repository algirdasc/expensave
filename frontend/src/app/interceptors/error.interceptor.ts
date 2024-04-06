import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import {plainToInstance} from 'class-transformer';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Error} from '../api/objects/error';

const REQUEST_VALIDATION_EXCEPTION: string = 'App\\Exception\\RequestValidationException';
const AUTH_EXCEPTION: string = 'Lexik\\Bundle\\JWTAuthenticationBundle\\Exception\\MissingTokenException';

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
                    if (response.status === 0) {
                        this.toastrService.danger('Cannot connect to server!', 'Connection error!');
                    } else {
                        const error: Error = plainToInstance(
                            Error,
                            response.error as Error,
                            { excludeExtraneousValues: true }
                        );

                        if (!error.throwable) {
                            this.toastrService.danger(response.message, response.statusText);
                        } else if (error.throwable !== REQUEST_VALIDATION_EXCEPTION) {
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
