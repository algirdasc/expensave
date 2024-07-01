import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { DateUtil } from '../util/date.util';
import { AbstractEntityApiService } from './abstract-entity-api.service';
import { Calendar } from './objects/calendar';
import { CalendarExpenseListResponse } from './response/calendar-expense-list.response';
import { StatementImportResponse } from './response/statement-import.response';

@Injectable()
export class CalendarApiService extends AbstractEntityApiService<Calendar> {
    protected backend: string = '/calendar';
    protected entity: Type<EntityInterface> = Calendar;

    public constructor(
        protected http: HttpClient,
        private dateService: NbDateService<Date>
    ) {
        super(http);
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

    public importStatements(calendar: Calendar, statements: FormData): Observable<StatementImportResponse> {
        return super.request('post', StatementImportResponse, `${this.backend}/${calendar.id}/import`, statements);
    }
}
