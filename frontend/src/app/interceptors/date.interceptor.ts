/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateUtil } from '../util/date.util';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
    private datePipe: DatePipe;

    public constructor() {
        this.datePipe = new DatePipe('en');
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method === 'POST' || req.method === 'PUT') {
            this.shiftDates(req.body);
        }

        return next.handle(req);
    }

    private shiftDates(body: any): void {
        if (body === null || body === undefined) {
            return;
        }

        if (typeof body !== 'object') {
            return;
        }

        for (const key of Object.keys(body)) {
            const value = body[key];
            if (value instanceof Date) {
                body[key] = this.datePipe.transform(body[key], DateUtil.DATE_TIME_FORMAT);
            } else if (typeof value === 'object') {
                this.shiftDates(value);
            }
        }
    }
}
