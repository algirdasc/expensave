import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractEntityApiService } from './abstract-entity-api.service';
import { Expense } from './objects/expense';

@Injectable()
export class ExpenseApiService extends AbstractEntityApiService<Expense> {
    protected backend: string = '/expense';
    protected entity: Type<EntityInterface> = Expense;

    public suggest(label: string): Observable<Expense> {
        return super.request<Expense>('post', Expense, `${this.backend}/suggest`, { label: label });
    }
}
