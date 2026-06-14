import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { CategoryApiService } from '../api/category.api.service';
import { Category } from '../api/objects/category';
import { QueryKeys } from './query-keys';
import { CategoryQueries } from './category.queries';

type QueryFn<TData> = () => Promise<TData>;
type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

describe('CategoryQueries', () => {
    let categoryApiService: jasmine.SpyObj<CategoryApiService>;
    let categoryQueries: CategoryQueries;
    let queryClient: jasmine.SpyObj<QueryClient>;

    beforeEach(() => {
        categoryApiService = jasmine.createSpyObj<CategoryApiService>('CategoryApiService', [
            'delete',
            'get',
            'list',
            'save',
            'system',
        ]);
        queryClient = jasmine.createSpyObj<QueryClient>('QueryClient', ['invalidateQueries']);
        queryClient.invalidateQueries.and.resolveTo();

        TestBed.configureTestingModule({
            providers: [
                CategoryQueries,
                { provide: CategoryApiService, useValue: categoryApiService },
                { provide: QueryClient, useValue: queryClient },
            ],
        });

        categoryQueries = TestBed.inject(CategoryQueries);
    });

    it('builds the category list query from params and delegates to the API service', async (): Promise<void> => {
        const categories = [categoryWithId(1)];
        const params = new HttpParams().set('definedByUser', 'true');
        const query = categoryQueries.list(params);

        categoryApiService.list.and.returnValue(of(categories));

        expect(query.queryKey).toEqual(QueryKeys.category.list(params));
        await expectAsync(queryFn<Category[]>(query)()).toBeResolvedTo(categories);
        expect(categoryApiService.list).toHaveBeenCalledOnceWith(params);
    });

    it('builds the category detail query and delegates to the API service', async (): Promise<void> => {
        const category = categoryWithId(3);
        const query = categoryQueries.get(category.id);

        categoryApiService.get.and.returnValue(of(category));

        expect(query.queryKey).toEqual(QueryKeys.category.detail(category.id));
        await expectAsync(queryFn<Category>(query)()).toBeResolvedTo(category);
        expect(categoryApiService.get).toHaveBeenCalledOnceWith(category.id);
    });

    it('builds the system-category query and delegates to the API service', async (): Promise<void> => {
        const categories = [categoryWithId(5)];
        const query = categoryQueries.system();

        categoryApiService.system.and.returnValue(of(categories));

        expect(query.queryKey).toEqual(QueryKeys.category.system);
        await expectAsync(queryFn<Category[]>(query)()).toBeResolvedTo(categories);
        expect(categoryApiService.system).toHaveBeenCalledOnceWith();
    });

    it('saves categories and invalidates category list and detail caches', async (): Promise<void> => {
        const category = categoryWithId(11);
        const mutation = categoryQueries.save();

        categoryApiService.save.and.returnValue(of(category));

        await expectAsync(mutationFn<Category, Category>(mutation)(category)).toBeResolvedTo(category);
        expect(categoryApiService.save).toHaveBeenCalledOnceWith(category);

        await mutation.onSuccess?.(category, category, undefined, undefined);

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.category.lists });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: QueryKeys.category.detail(category.id),
        });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.calendar.expenses });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.report.all });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.expense.all });
    });

    it('deletes categories and invalidates category list and detail caches', async (): Promise<void> => {
        const category = categoryWithId(13);
        const categories = [categoryWithId(14)];
        const mutation = categoryQueries.delete();

        categoryApiService.delete.and.returnValue(of(categories));

        await expectAsync(mutationFn<Category[], Category>(mutation)(category)).toBeResolvedTo(categories);
        expect(categoryApiService.delete).toHaveBeenCalledOnceWith(category.id);

        await mutation.onSuccess?.(categories, category, undefined, undefined);

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.category.lists });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: QueryKeys.category.detail(category.id),
        });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.calendar.expenses });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.report.all });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.expense.all });
    });
});

const categoryWithId = (id: number): Category => {
    const category = new Category();
    category.id = id;

    return category;
};

const queryFn = <TData>(query: { queryFn?: unknown }): QueryFn<TData> => query.queryFn as QueryFn<TData>;

const mutationFn = <TData, TVariables>(mutation: { mutationFn?: unknown }): MutationFn<TData, TVariables> =>
    mutation.mutationFn as MutationFn<TData, TVariables>;
