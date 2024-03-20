import {Injectable} from '@angular/core';
import {AbstractApiService} from './abstract.api.service';
import {Expense} from './entities/expense.entity';

@Injectable()
export class ExpenseApiService extends AbstractApiService<Expense> {
    protected backend: string = '/expense';
    protected entity: any = Expense;
}
