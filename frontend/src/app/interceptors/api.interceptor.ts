import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers;
    if (!req.headers.has('Content-Type')) {
      headers = req.headers.set('Content-Type', 'application/json');
    }

    const apiReq = req.clone({
      url: environment.apiUrl + req.urlWithParams,
      headers: headers,
    });

    return next.handle(apiReq);
  }
}
