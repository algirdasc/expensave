/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { plainToInstance } from 'class-transformer';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { DateUtil } from '../util/date.util';
import { Calendar } from './objects/calendar';
import { CategoryExpenseReportResponse } from './response/category-expense-report.response';
import { ExpenseReportResponse } from './response/expense-report.response';

@Injectable()
export class ReportsApiService {
    public onBusyChange: Subject<boolean> = new Subject<boolean>();
    private backend: string = '/report';

    public constructor(
        private http: HttpClient,
        private dateService: NbDateService<Date>
    ) {}

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
        const dateFromString = dateFrom ? this.dateService.format(dateFrom, DateUtil.DATE_FORMAT) : '1970-01-01';
        const dateToString = this.dateService.format(dateTo, DateUtil.DATE_FORMAT);

        return this.http.get(`${this.backend}/${reportType}/${calendarIDs}/${dateFromString}/${dateToString}`).pipe(
            finalize(() => this.onBusyChange.next(false)),
            map((response: HttpResponse<T>) => this.convertToType(responseType, response))
        );
    }

    protected convertToType<K>(type: any, response: HttpResponse<K>): K {
        return plainToInstance(type, response, { excludeExtraneousValues: true });
    }
}
