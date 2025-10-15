import { HttpClient } from '@angular/common/http';
import { Injectable, Type, inject } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { DateUtil } from '../util/date.util';
import { AbstractEntityApiService } from './abstract-entity-api.service';
import { Calendar } from './objects/calendar';
import { CalendarExpenseListResponse } from './response/calendar-expense-list.response';

@Injectable()
export class CalendarApiService extends AbstractEntityApiService<Calendar> {
    protected http: HttpClient;
    private dateService = inject<NbDateService<Date>>(NbDateService);

    protected backend: string = '/calendar';
    protected entity: Type<EntityInterface> = Calendar;

    public constructor() {
        const http = inject(HttpClient);

        super(http);

        this.http = http;
    }

    public listExpenses(calendar: Calendar, dateFrom: Date, dateTo: Date): Observable<CalendarExpenseListResponse> {
        const dateFromString = this.dateService.format(dateFrom, DateUtil.DATE_FORMAT);
        const dateToString = this.dateService.format(dateTo, DateUtil.DATE_FORMAT);

        return super.request<CalendarExpenseListResponse>(
            'get',
            CalendarExpenseListResponse,
            `${this.backend}/${calendar.id}/expenses/${dateFromString}/${dateToString}`
        );
    }
}
