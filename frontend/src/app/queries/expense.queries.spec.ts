import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ExpenseApiService } from '../api/expense.api.service';
import { Expense } from '../api/objects/expense';
import { QueryKeys } from './query-keys';
import { ExpenseQueries } from './expense.queries';

type QueryFn<TData> = () => Promise<TData>;
type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

describe('ExpenseQueries', () => {
    let expenseApiService: jasmine.SpyObj<ExpenseApiService>;
    let expenseQueries: ExpenseQueries;
    let queryClient: jasmine.SpyObj<QueryClient>;

    beforeEach(() => {
        expenseApiService = jasmine.createSpyObj<ExpenseApiService>('ExpenseApiService', [
            'delete',
            'get',
            'import',
            'save',
            'suggest',
        ]);
        queryClient = jasmine.createSpyObj<QueryClient>('QueryClient', ['invalidateQueries']);
        queryClient.invalidateQueries.and.resolveTo();

        TestBed.configureTestingModule({
            providers: [
                ExpenseQueries,
                { provide: ExpenseApiService, useValue: expenseApiService },
                { provide: QueryClient, useValue: queryClient },
            ],
        });

        expenseQueries = TestBed.inject(ExpenseQueries);
    });

    it('builds the expense detail query and delegates to the API service', async (): Promise<void> => {
        const expense = expenseWithId(3);
        const query = expenseQueries.get(expense.id);

        expenseApiService.get.and.returnValue(of(expense));

        expect(query.queryKey).toEqual(QueryKeys.expense.detail(expense.id));
        await expectAsync(queryFn<Expense>(query)()).toBeResolvedTo(expense);
        expect(expenseApiService.get).toHaveBeenCalledOnceWith(expense.id);
    });

    it('builds the expense suggestion query and delegates to the API service', async (): Promise<void> => {
        const label = 'coffee';
        const suggestion = expenseWithId(5);
        const query = expenseQueries.suggest(label);

        expenseApiService.suggest.and.returnValue(of(suggestion));

        expect(query.queryKey).toEqual(QueryKeys.expense.suggestion(label));
        await expectAsync(queryFn<Expense>(query)()).toBeResolvedTo(suggestion);
        expect(expenseApiService.suggest).toHaveBeenCalledOnceWith(label);
    });

    it('saves expenses and invalidates affected calendar and report caches', async (): Promise<void> => {
        const expense = expenseWithId(11);
        const mutation = expenseQueries.save();

        expenseApiService.save.and.returnValue(of(expense));

        await expectAsync(mutationFn<Expense, Expense>(mutation)(expense)).toBeResolvedTo(expense);
        expect(expenseApiService.save).toHaveBeenCalledOnceWith(expense);

        await mutation.onSuccess?.(expense, expense, undefined, undefined);

        expectAffectedDomainInvalidations();
    });

    it('deletes expenses and invalidates affected calendar and report caches', async (): Promise<void> => {
        const expense = expenseWithId(13);
        const expenses = [expenseWithId(14)];
        const mutation = expenseQueries.delete();

        expenseApiService.delete.and.returnValue(of(expenses));

        await expectAsync(mutationFn<Expense[], Expense>(mutation)(expense)).toBeResolvedTo(expenses);
        expect(expenseApiService.delete).toHaveBeenCalledOnceWith(expense.id);

        await mutation.onSuccess?.(expenses, expense, undefined, undefined);

        expectAffectedDomainInvalidations();
    });

    it('imports expenses and invalidates affected calendar and report caches', async (): Promise<void> => {
        const expenses = [expenseWithId(17), expenseWithId(19)];
        const mutation = expenseQueries.import();

        expenseApiService.import.and.returnValue(of(expenses));

        await expectAsync(mutationFn<Expense[], Expense[]>(mutation)(expenses)).toBeResolvedTo(expenses);
        expect(expenseApiService.import).toHaveBeenCalledOnceWith(expenses);

        await mutation.onSuccess?.(expenses, expenses, undefined, undefined);

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

const queryFn = <TData>(query: { queryFn?: unknown }): QueryFn<TData> => query.queryFn as QueryFn<TData>;

const mutationFn = <TData, TVariables>(mutation: { mutationFn?: unknown }): MutationFn<TData, TVariables> =>
    mutation.mutationFn as MutationFn<TData, TVariables>;
