import {Injectable, Type} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractApiService} from './abstract.api.service';
import {EntityInterface} from './entities/entity.interface';
import {Expense} from './entities/expense.entity';
import {ExpenseSuggestResponse} from './response/expense-suggest.response';

@Injectable()
export class ExpenseApiService extends AbstractApiService<Expense> {
    protected backend: string = '/expense';
    protected entity: Type<EntityInterface> = Expense;

    public suggest(label: string): Observable<ExpenseSuggestResponse> {
        return super.request<ExpenseSuggestResponse>(
            'post',
            ExpenseSuggestResponse,
            `${this.backend}/suggest`, {'label': label}
        );
    }
}
