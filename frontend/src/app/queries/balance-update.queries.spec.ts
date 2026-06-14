import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { BalanceUpdateApiService } from '../api/balance-update.api.service';
import { Expense } from '../api/objects/expense';
import { QueryKeys } from './query-keys';
import { BalanceUpdateQueries } from './balance-update.queries';

type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

describe('BalanceUpdateQueries', () => {
    let balanceUpdateApiService: jasmine.SpyObj<BalanceUpdateApiService>;
    let balanceUpdateQueries: BalanceUpdateQueries;
    let queryClient: jasmine.SpyObj<QueryClient>;

    beforeEach(() => {
        balanceUpdateApiService = jasmine.createSpyObj<BalanceUpdateApiService>('BalanceUpdateApiService', [
            'delete',
            'save',
        ]);
        queryClient = jasmine.createSpyObj<QueryClient>('QueryClient', ['invalidateQueries']);
        queryClient.invalidateQueries.and.resolveTo();

        TestBed.configureTestingModule({
            providers: [
                BalanceUpdateQueries,
                { provide: BalanceUpdateApiService, useValue: balanceUpdateApiService },
                { provide: QueryClient, useValue: queryClient },
            ],
        });

        balanceUpdateQueries = TestBed.inject(BalanceUpdateQueries);
    });

    it('saves balance updates and invalidates affected calendar and report caches', async (): Promise<void> => {
        const expense = expenseWithId(11);
        const mutation = balanceUpdateQueries.save();

        balanceUpdateApiService.save.and.returnValue(of(expense));

        await expectAsync(mutationFn<Expense, Expense>(mutation)(expense)).toBeResolvedTo(expense);
        expect(balanceUpdateApiService.save).toHaveBeenCalledOnceWith(expense);

        await mutation.onSuccess?.(expense, expense, undefined, undefined);

        expectAffectedDomainInvalidations();
    });

    it('deletes balance updates and invalidates affected calendar and report caches', async (): Promise<void> => {
        const expense = expenseWithId(13);
        const expenses = [expenseWithId(14)];
        const mutation = balanceUpdateQueries.delete();

        balanceUpdateApiService.delete.and.returnValue(of(expenses));

        await expectAsync(mutationFn<Expense[], Expense>(mutation)(expense)).toBeResolvedTo(expenses);
        expect(balanceUpdateApiService.delete).toHaveBeenCalledOnceWith(expense.id);

        await mutation.onSuccess?.(expenses, expense, undefined, undefined);

        expectAffectedDomainInvalidations();
    });

    const expectAffectedDomainInvalidations = (): void => {
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.calendar.lists });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.calendar.details });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.calendar.expenses });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.report.all });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.expense.all });
    };
});

const expenseWithId = (id: number): Expense => {
    const expense = new Expense();
    expense.id = id;

    return expense;
};

const mutationFn = <TData, TVariables>(mutation: { mutationFn?: unknown }): MutationFn<TData, TVariables> =>
    mutation.mutationFn as MutationFn<TData, TVariables>;
