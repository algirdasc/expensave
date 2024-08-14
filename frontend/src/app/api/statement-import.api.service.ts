import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractApiService } from './abstract.api.service';
import { Calendar } from './objects/calendar';
import { StatementImportResponse } from './response/statement-import.response';

@Injectable()
export class StatementImportApiService extends AbstractApiService {
    protected backend: string = '/calendar';

    public import(calendar: Calendar, statements: FormData): Observable<StatementImportResponse> {
        return super.request('post', StatementImportResponse, `${this.backend}/${calendar.id}/import`, statements);
    }
}
