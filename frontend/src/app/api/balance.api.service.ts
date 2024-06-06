import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Category } from './objects/category';
import { Expense } from './objects/expense';

@Injectable()
export class BalanceApiService extends AbstractApiService<Expense> {
    protected backend: string = '/balance';
    protected entity: Type<EntityInterface> = Expense;

    public category(): Observable<Category> {
        return super.request<Category>('get', Category, `${this.backend}/category`);
    }
}
