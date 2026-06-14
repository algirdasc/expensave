/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { mutationOptions, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Expense } from '../api/objects/expense';
import { BalanceUpdateApiService } from '../api/balance-update.api.service';
import { QueryKeys } from './query-keys';

@Injectable({ providedIn: 'root' })
export class BalanceUpdateQueries {
    private readonly balanceUpdateApiService = inject(BalanceUpdateApiService);
    private readonly queryClient = inject(QueryClient);

    public save() {
        return mutationOptions({
            mutationKey: ['balance-update', 'save'],
            mutationFn: (expense: Expense): Promise<Expense> =>
                lastValueFrom(this.balanceUpdateApiService.save(expense)),
            onSuccess: (): Promise<void[]> => this.invalidateBalanceUpdateAffectedQueries(),
        });
    }

    public delete() {
        return mutationOptions({
            mutationKey: ['balance-update', 'delete'],
            mutationFn: (expense: Expense): Promise<Expense[]> =>
                lastValueFrom(this.balanceUpdateApiService.delete(expense.id)),
            onSuccess: (): Promise<void[]> => this.invalidateBalanceUpdateAffectedQueries(),
        });
    }

    private invalidateBalanceUpdateAffectedQueries(): Promise<void[]> {
        return Promise.all([
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.lists }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.details }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.expenses }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.report.all }),
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.expense.all }),
        ]);
    }
}
