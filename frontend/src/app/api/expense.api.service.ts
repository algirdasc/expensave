import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractApiService} from './abstract.api.service';
import {Calendar} from './entities/calendar.entity';
import {Expense} from './entities/expense.entity';

@Injectable()
export class ExpenseApiService extends AbstractApiService<Expense> {
    protected backend: string = '/expense';
    protected entity: any = Expense;

    public list(calendar: Calendar, fromDate: Date, toDate: Date): Observable<Expense[]> {
        return super.list(`${this.backend}/${calendar.id}/${fromDate.getTime() / 1000}/${toDate.getTime() / 1000}`);
    }
}
