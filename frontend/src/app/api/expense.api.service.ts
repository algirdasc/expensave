import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Calendar } from './objects/calendar';
import { Expense } from './objects/expense';

@Injectable()
export class ExpenseApiService extends AbstractApiService<Expense> {
    protected backend: string = '/expense';
    protected entity: Type<EntityInterface> = Expense;

    public suggest(label: string): Observable<Expense> {
        return super.request<Expense>('post', Expense, `${this.backend}/suggest`, { label: label });
    }

    public transfer(expense: Expense, destinationCalendar: Calendar): Observable<Expense> {
        return super.request<Expense>('post', Expense, `${this.backend}/transfer/${destinationCalendar.id}`);
    }
}
