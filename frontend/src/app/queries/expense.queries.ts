/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ExpenseApiService } from '../api/expense.api.service';
import { Expense } from '../api/objects/expense';
import { QueryKeys } from './query-keys';

@Injectable({ providedIn: 'root' })
export class ExpenseQueries {
    private readonly expenseApiService = inject(ExpenseApiService);

    public get(expenseId: number) {
        return queryOptions({
            queryKey: QueryKeys.expense.detail(expenseId),
            queryFn: (): Promise<Expense> => lastValueFrom(this.expenseApiService.get(expenseId)),
        });
    }

    public suggest(label: string) {
        return queryOptions({
            queryKey: QueryKeys.expense.suggestion(label),
            queryFn: (): Promise<Expense> => lastValueFrom(this.expenseApiService.suggest(label)),
        });
    }
}
