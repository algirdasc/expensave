/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ExpenseApiService } from '../api/expense.api.service';
import { Expense } from '../api/objects/expense';
import { QueryKeys } from './query-keys';

@Injectable({ providedIn: 'root' })
export class ExpenseQueries {
    private readonly expenseApiService = inject(ExpenseApiService);
    private readonly queryClient = inject(QueryClient);

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

    public save() {
        return mutationOptions({
            mutationKey: ['expense', 'save'],
            mutationFn: (expense: Expense): Promise<Expense> => lastValueFrom(this.expenseApiService.save(expense)),
            onSuccess: (): Promise<void[]> => this.invalidateExpenseAffectedQueries(),
        });
    }

    public delete() {
        return mutationOptions({
            mutationKey: ['expense', 'delete'],
            mutationFn: (expense: Expense): Promise<Expense[]> =>
                lastValueFrom(this.expenseApiService.delete(expense.id)),
            onSuccess: (): Promise<void[]> => this.invalidateExpenseAffectedQueries(),
        });
    }

    public import() {
        return mutationOptions({
            mutationKey: ['expense', 'import'],
            mutationFn: (expenses: Expense[]): Promise<Expense[]> =>
                lastValueFrom(this.expenseApiService.import(expenses)),
            onSuccess: (): Promise<void[]> => this.invalidateExpenseAffectedQueries(),
        });
    }

    private invalidateExpenseAffectedQueries(): Promise<void[]> {
        return Promise.all([
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.lists }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.details }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.expenses }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.report.all }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.expense.all }),
        ]);
    }
}
