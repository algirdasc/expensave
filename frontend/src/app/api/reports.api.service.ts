/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Calendar } from './objects/calendar';
import { CategoryExpenseReportResponse } from './response/category-expense-report.response';
import { ExpenseReportResponse } from './response/expense-report.response';

@Injectable()
export class ReportsApiService {
    public onBusyChange: Subject<boolean> = new Subject<boolean>();
    private backend: string = '/report';

    constructor(private http: HttpClient) {}

    public dailyExpenses(calendars: Calendar[], dateFrom: Date, dateTo: Date): Observable<ExpenseReportResponse> {
        return this.reportRequest<ExpenseReportResponse>(
            'daily-expenses',
            ExpenseReportResponse,
            calendars,
            dateFrom,
            dateTo
        );
    }

    public monthlyExpenses(calendars: Calendar[], dateFrom: Date, dateTo: Date): Observable<ExpenseReportResponse> {
        return this.reportRequest<ExpenseReportResponse>(
            'monthly-expenses',
            ExpenseReportResponse,
            calendars,
            dateFrom,
            dateTo
        );
    }

    public categoryExpenses(
        calendars: Calendar[],
        dateFrom: Date,
        dateTo: Date
    ): Observable<CategoryExpenseReportResponse> {
        return this.reportRequest<CategoryExpenseReportResponse>(
            'category-expenses',
            CategoryExpenseReportResponse,
            calendars,
            dateFrom,
            dateTo
        );
    }

    protected reportRequest<T>(
        reportType: string,
        responseType: any,
        calendars: Calendar[],
        dateFrom: Date,
        dateTo: Date
    ): Observable<T> {
        this.onBusyChange.next(true);

        const calendarIDs = calendars.map((calendar: Calendar) => calendar.id).join(',');
        const tsFrom = dateFrom === undefined ? 0 : dateFrom.getTime() / 1000;
        const tsTo = dateTo.getTime() / 1000;

        return this.http.get(`${this.backend}/${reportType}/${calendarIDs}/${tsFrom}/${tsTo}`).pipe(
            finalize(() => this.onBusyChange.next(false)),
            map((response: HttpResponse<T>) => this.convertToType(responseType, response))
        );
    }

    protected convertToType<K>(type: any, response: HttpResponse<K>): K {
        return plainToInstance(type, response, { excludeExtraneousValues: true });
    }
}
