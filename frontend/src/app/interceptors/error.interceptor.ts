import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import {plainToInstance} from 'class-transformer';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Error} from '../api/entities/error.entity';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private toastrService: NbToastrService
    ) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((response: HttpErrorResponse) => {
                    //const errorEntity = plainToInstance(Error, errorResponse.error as Error, { excludeExtraneousValues: true });

                    //this.toastrService.danger(errorEntity.messages[0], errorEntity.throwable);

                    this.toastrService.danger(response.message, response.statusText);

                    return throwError(response);
                })
            );
    }
}