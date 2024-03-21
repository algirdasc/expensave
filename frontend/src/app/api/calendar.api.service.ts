/* eslint-disable @typescript-eslint/no-explicit-any */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractApiService} from './abstract.api.service';
import {Calendar} from './entities/calendar.entity';
import {CalendarExpenseListResponse} from './response/calendar-expense-list.response';

@Injectable()
export class CalendarApiService extends AbstractApiService<Calendar> {
    protected backend: string = '/calendar';
    protected entity: any = Calendar;

    public listExpenses(calendar: Calendar, fromDate: Date, toDate: Date): Observable<CalendarExpenseListResponse> {
        return super.request<CalendarExpenseListResponse>(
            'get',
            CalendarExpenseListResponse,
            `${this.backend}/${calendar.id}/expenses/${fromDate.getTime() / 1000}/${toDate.getTime() / 1000}`
        );
    }
}
