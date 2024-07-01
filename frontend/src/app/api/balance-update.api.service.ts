import { Injectable, Type } from '@angular/core';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractEntityApiService } from './abstract-entity-api.service';
import { Expense } from './objects/expense';

@Injectable()
export class BalanceUpdateApiService extends AbstractEntityApiService<Expense> {
    protected backend: string = '/balance-update';
    protected entity: Type<EntityInterface> = Expense;
}
