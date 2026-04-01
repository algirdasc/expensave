import { inject, Injectable } from '@angular/core';
import { ExpenseApiService } from '../api/expense.api.service';
import { HttpParams } from '@angular/common/http';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Expense } from '../api/objects/expense';

@Injectable()
export class ExpenseQueries {
    expenseApiService = inject(ExpenseApiService);

    list(params?: HttpParams) {
        return queryOptions({
            queryKey: ['expenses', { params: params }],
            queryFn: (): Promise<Expense[]> => lastValueFrom(this.expenseApiService.list(params)),
        });
    }
}
