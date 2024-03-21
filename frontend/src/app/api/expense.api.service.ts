import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractApiService} from './abstract.api.service';
import {Expense} from './entities/expense.entity';
import {ExpenseSuggestResponse} from './response/expense-suggest.response';

@Injectable()
export class ExpenseApiService extends AbstractApiService<Expense> {
    protected backend: string = '/expense';
    protected entity: any = Expense;

    public suggest(label: string): Observable<ExpenseSuggestResponse> {
        return super.request<ExpenseSuggestResponse>('post', ExpenseSuggestResponse, `${this.backend}/suggest`, {'label': label});
    }
}
