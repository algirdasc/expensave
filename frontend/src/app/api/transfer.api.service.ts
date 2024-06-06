import { Injectable, Type } from '@angular/core';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Expense } from './objects/expense';

@Injectable()
export class TransferApiService extends AbstractApiService<Expense> {
    protected backend: string = '/transfer';
    protected entity: Type<EntityInterface> = Expense;
}
