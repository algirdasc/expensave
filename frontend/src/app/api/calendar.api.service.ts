import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Calendar } from './objects/calendar';
import { CalendarExpenseListResponse } from './response/calendar-expense-list.response';
import { StatementImportResponse } from './response/statement-import.response';

@Injectable()
export class CalendarApiService extends AbstractApiService<Calendar> {
    protected backend: string = '/calendar';
    protected entity: Type<EntityInterface> = Calendar;

    public listExpenses(calendar: Calendar, dateFrom: Date, dateTo: Date): Observable<CalendarExpenseListResponse> {
        return super.request<CalendarExpenseListResponse>(
            'get',
            CalendarExpenseListResponse,
            `${this.backend}/${calendar.id}/expenses/${dateFrom.getTime() / 1000}/${dateTo.getTime() / 1000}`
        );
    }

    public importStatements(calendar: Calendar, statements: FormData): Observable<StatementImportResponse> {
        return super.request('post', StatementImportResponse, `${this.backend}/${calendar.id}/import`, statements);
    }
}
