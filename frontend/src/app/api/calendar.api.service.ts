import { inject, Injectable, Type } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { DateUtil } from '../util/date.util';
import { AbstractEntityApiService } from './abstract-entity-api.service';
import { Calendar } from './objects/calendar';
import { CalendarExpenseListResponse } from './response/calendar-expense-list.response';

@Injectable({ providedIn: 'root' })
export class CalendarApiService extends AbstractEntityApiService<Calendar> {
    protected backend: string = '/calendar';
    protected entity: Type<EntityInterface> = Calendar;

    private dateService = inject<NbDateService<Date>>(NbDateService);

    public listExpenses(calendar: Calendar, dateFrom: Date, dateTo: Date): Observable<CalendarExpenseListResponse> {
        return this.listExpensesById(calendar.id, dateFrom, dateTo);
    }

    public exportExpenses(calendarId: number, dateFrom: Date, dateTo: Date): Observable<Blob> {
        const dateFromString = this.dateService.format(dateFrom, DateUtil.DATE_FORMAT);
        const dateToString = this.dateService.format(dateTo, DateUtil.DATE_FORMAT);

        return this.http.get(`${this.backend}/${calendarId}/export/${dateFromString}/${dateToString}`, {
            responseType: 'blob',
        });
    }

    public listExpensesById(calendarId: number, dateFrom: Date, dateTo: Date): Observable<CalendarExpenseListResponse> {
        const dateFromString = this.dateService.format(dateFrom, DateUtil.DATE_FORMAT);
        const dateToString = this.dateService.format(dateTo, DateUtil.DATE_FORMAT);

        return super.request<CalendarExpenseListResponse>(
            'get',
            CalendarExpenseListResponse,
            `${this.backend}/${calendarId}/expenses/${dateFromString}/${dateToString}`
        );
    }
}
