import { HttpResponse } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Calendar } from './objects/calendar';
import { Expense } from './objects/expense';

@Injectable()
export class ExpenseTransferApiService extends AbstractApiService<Expense> {
    protected backend: string = '/expense-transfer';
    protected entity: Type<EntityInterface> = Expense;

    public transfer(entity: Expense, destinationCalendar: Calendar): Observable<Expense> {
        this.changeIsBusy(true);

        const request = entity.id
            ? this.http.put(`${this.backend}/${destinationCalendar.id}/${entity.id}`, entity)
            : this.http.post(`${this.backend}/${destinationCalendar.id}`, entity);

        return request.pipe(
            finalize(() => this.changeIsBusy(false)),
            map((response: HttpResponse<Expense>) => this.convertToType<Expense>(this.entity, response))
        );
    }
}
