import { HttpHandler, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { APP_CONFIG } from '../app.initializer';
import { ApiInterceptor } from './api.interceptor';

describe('ApiInterceptor', () => {
    let interceptor: ApiInterceptor;
    let handler: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        APP_CONFIG.apiUrl = 'http://localhost:18001/api';
        interceptor = new ApiInterceptor();
        handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
        handler.handle.and.returnValue(of(new HttpResponse()));
    });

    afterEach(() => {
        APP_CONFIG.apiUrl = '';
    });

    it('prefixes API URL without duplicating query params', () => {
        const params = new HttpParams().set('userCategoriesOnly', '0');
        const request = new HttpRequest('GET', '/category', { params });

        interceptor.intercept(request, handler).subscribe();

        const handledRequest = handler.handle.calls.mostRecent().args[0];
        expect(handledRequest.urlWithParams).toBe('http://localhost:18001/api/category?userCategoriesOnly=0');
    });

    it('sets JSON content type when request body is not form data', () => {
        const request = new HttpRequest('POST', '/category', { name: 'Food' });

        interceptor.intercept(request, handler).subscribe();

        const handledRequest = handler.handle.calls.mostRecent().args[0];
        expect(handledRequest.headers.get('Content-Type')).toBe('application/json');
    });

    it('does not set content type for form data uploads', () => {
        const request = new HttpRequest('POST', '/statement-import', new FormData());

        interceptor.intercept(request, handler).subscribe();

        const handledRequest = handler.handle.calls.mostRecent().args[0];
        expect(handledRequest.headers.has('Content-Type')).toBeFalse();
    });
});
