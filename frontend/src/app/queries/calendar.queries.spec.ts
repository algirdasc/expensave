import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { CalendarApiService } from '../api/calendar.api.service';
import { Calendar } from '../api/objects/calendar';
import { CalendarExpenseListResponse } from '../api/response/calendar-expense-list.response';
import { QueryKeys } from './query-keys';
import { CalendarQueries } from './calendar.queries';

type QueryFn<TData> = () => Promise<TData>;
type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

describe('CalendarQueries', () => {
    let calendarApiService: jasmine.SpyObj<CalendarApiService>;
    let calendarQueries: CalendarQueries;
    let queryClient: jasmine.SpyObj<QueryClient>;

    beforeEach(() => {
        calendarApiService = jasmine.createSpyObj<CalendarApiService>('CalendarApiService', [
            'delete',
            'get',
            'list',
            'listExpensesById',
            'save',
        ]);
        queryClient = jasmine.createSpyObj<QueryClient>('QueryClient', ['invalidateQueries']);
        queryClient.invalidateQueries.and.resolveTo();

        TestBed.configureTestingModule({
            providers: [
                CalendarQueries,
                { provide: CalendarApiService, useValue: calendarApiService },
                { provide: QueryClient, useValue: queryClient },
            ],
        });

        calendarQueries = TestBed.inject(CalendarQueries);
    });

    it('builds the calendar list query from params and delegates to the API service', async (): Promise<void> => {
        const calendars = [calendarWithId(1)];
        const params = new HttpParams().set('shared', 'true');
        const query = calendarQueries.list(params);

        calendarApiService.list.and.returnValue(of(calendars));

        expect(query.queryKey).toEqual(QueryKeys.calendar.list(params));
        await expectAsync(queryFn<Calendar[]>(query)()).toBeResolvedTo(calendars);
        expect(calendarApiService.list).toHaveBeenCalledOnceWith(params);
    });

    it('builds the calendar detail query and delegates to the API service', async (): Promise<void> => {
        const calendar = calendarWithId(3);
        const query = calendarQueries.get(calendar.id);

        calendarApiService.get.and.returnValue(of(calendar));

        expect(query.queryKey).toEqual(QueryKeys.calendar.detail(calendar.id));
        await expectAsync(queryFn<Calendar>(query)()).toBeResolvedTo(calendar);
        expect(calendarApiService.get).toHaveBeenCalledOnceWith(calendar.id);
    });

    it('builds the expense-list query and delegates to the API service', async (): Promise<void> => {
        const calendarId = 7;
        const dateFrom = new Date('2026-01-01T00:00:00');
        const dateTo = new Date('2026-01-31T00:00:00');
        const response = new CalendarExpenseListResponse();
        const query = calendarQueries.expenseList(calendarId, dateFrom, dateTo);

        calendarApiService.listExpensesById.and.returnValue(of(response));

        expect(query.queryKey).toEqual(QueryKeys.calendar.expenseList(calendarId, dateFrom, dateTo));
        await expectAsync(queryFn<CalendarExpenseListResponse>(query)()).toBeResolvedTo(response);
        expect(calendarApiService.listExpensesById).toHaveBeenCalledOnceWith(calendarId, dateFrom, dateTo);
    });

    it('saves calendars and invalidates calendar list and detail caches', async (): Promise<void> => {
        const calendar = calendarWithId(11);
        const mutation = calendarQueries.save();

        calendarApiService.save.and.returnValue(of(calendar));

        await expectAsync(mutationFn<Calendar, Calendar>(mutation)(calendar)).toBeResolvedTo(calendar);
        expect(calendarApiService.save).toHaveBeenCalledOnceWith(calendar);

        await mutation.onSuccess?.(calendar, calendar, undefined, undefined);

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.calendar.lists });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: QueryKeys.calendar.detail(calendar.id),
        });
    });

    it('deletes calendars and invalidates calendar list and detail caches', async (): Promise<void> => {
        const calendar = calendarWithId(13);
        const calendars = [calendarWithId(14)];
        const mutation = calendarQueries.delete();

        calendarApiService.delete.and.returnValue(of(calendars));

        await expectAsync(mutationFn<Calendar[], Calendar>(mutation)(calendar)).toBeResolvedTo(calendars);
        expect(calendarApiService.delete).toHaveBeenCalledOnceWith(calendar.id);

        await mutation.onSuccess?.(calendars, calendar, undefined, undefined);

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.calendar.lists });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: QueryKeys.calendar.detail(calendar.id),
        });
    });
});

const calendarWithId = (id: number): Calendar => {
    const calendar = new Calendar();
    calendar.id = id;

    return calendar;
};

const queryFn = <TData>(query: { queryFn?: unknown }): QueryFn<TData> => query.queryFn as QueryFn<TData>;

const mutationFn = <TData, TVariables>(mutation: { mutationFn?: unknown }): MutationFn<TData, TVariables> =>
    mutation.mutationFn as MutationFn<TData, TVariables>;
