import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Category } from './objects/category';
import { Expense } from './objects/expense';

@Injectable()
export class BalanceUpdateApiService extends AbstractApiService<Expense> {
    protected backend: string = '/balance-update';
    protected entity: Type<EntityInterface> = Expense;
}
