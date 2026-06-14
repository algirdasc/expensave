import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReportsApiService } from '../api/reports.api.service';
import { Calendar } from '../api/objects/calendar';
import { CategoryExpenseReportResponse } from '../api/response/category-expense-report.response';
import { ExpenseReportResponse } from '../api/response/expense-report.response';
import { QueryKeys } from './query-keys';
import { ReportMethod, ReportsQueries } from './reports.queries';

type QueryFn<TData> = () => Promise<TData>;

describe('ReportsQueries', () => {
    let reportsApiService: jasmine.SpyObj<ReportsApiService>;
    let reportsQueries: ReportsQueries;

    beforeEach(() => {
        reportsApiService = jasmine.createSpyObj<ReportsApiService>('ReportsApiService', [
            'categoryExpenses',
            'dailyExpenses',
            'monthlyExpenses',
        ]);

        TestBed.configureTestingModule({
            providers: [ReportsQueries, { provide: ReportsApiService, useValue: reportsApiService }],
        });

        reportsQueries = TestBed.inject(ReportsQueries);
    });

    it('builds the generic daily-expenses report query and delegates to the API service', async (): Promise<void> => {
        const response = new ExpenseReportResponse();

        reportsApiService.dailyExpenses.and.returnValue(of(response));

        await expectGenericReport('dailyExpenses', response);

        expect(reportsApiService.dailyExpenses).toHaveBeenCalledOnceWith(
            calendarIdObjects([1, 2]),
            dateFrom(),
            dateTo()
        );
    });

    it('builds the generic monthly-expenses report query and delegates to the API service', async (): Promise<void> => {
        const response = new ExpenseReportResponse();

        reportsApiService.monthlyExpenses.and.returnValue(of(response));

        await expectGenericReport('monthlyExpenses', response);

        expect(reportsApiService.monthlyExpenses).toHaveBeenCalledOnceWith(
            calendarIdObjects([1, 2]),
            dateFrom(),
            dateTo()
        );
    });

    it('builds the generic category-expenses report query and delegates to the API service', async (): Promise<void> => {
        const response = new CategoryExpenseReportResponse();

        reportsApiService.categoryExpenses.and.returnValue(of(response));

        await expectGenericReport('categoryExpenses', response);

        expect(reportsApiService.categoryExpenses).toHaveBeenCalledOnceWith(
            calendarIdObjects([1, 2]),
            dateFrom(),
            dateTo()
        );
    });

    it('builds the category-expenses query and delegates to the API service', async (): Promise<void> => {
        const calendarIds = [3, 5];
        const response = new CategoryExpenseReportResponse();
        const query = reportsQueries.categoryExpenses(calendarIds, dateFrom(), dateTo());

        reportsApiService.categoryExpenses.and.returnValue(of(response));

        expect(query.queryKey).toEqual(QueryKeys.report.categoryExpenses(calendarIds, dateFrom(), dateTo()));
        await expectAsync(queryFn<CategoryExpenseReportResponse>(query)()).toBeResolvedTo(response);
        expect(reportsApiService.categoryExpenses).toHaveBeenCalledOnceWith(
            calendarIdObjects(calendarIds),
            dateFrom(),
            dateTo()
        );
    });

    it('builds the daily-expenses query and delegates to the API service', async (): Promise<void> => {
        const calendarIds = [7, 11];
        const response = new ExpenseReportResponse();
        const query = reportsQueries.dailyExpenses(calendarIds, dateFrom(), dateTo());

        reportsApiService.dailyExpenses.and.returnValue(of(response));

        expect(query.queryKey).toEqual(QueryKeys.report.dailyExpenses(calendarIds, dateFrom(), dateTo()));
        await expectAsync(queryFn<ExpenseReportResponse>(query)()).toBeResolvedTo(response);
        expect(reportsApiService.dailyExpenses).toHaveBeenCalledOnceWith(
            calendarIdObjects(calendarIds),
            dateFrom(),
            dateTo()
        );
    });

    it('builds the monthly-expenses query and delegates to the API service', async (): Promise<void> => {
        const calendarIds = [13, 17];
        const response = new ExpenseReportResponse();
        const query = reportsQueries.monthlyExpenses(calendarIds, dateFrom(), dateTo());

        reportsApiService.monthlyExpenses.and.returnValue(of(response));

        expect(query.queryKey).toEqual(QueryKeys.report.monthlyExpenses(calendarIds, dateFrom(), dateTo()));
        await expectAsync(queryFn<ExpenseReportResponse>(query)()).toBeResolvedTo(response);
        expect(reportsApiService.monthlyExpenses).toHaveBeenCalledOnceWith(
            calendarIdObjects(calendarIds),
            dateFrom(),
            dateTo()
        );
    });

    const expectGenericReport = async (
        method: ReportMethod,
        response: ExpenseReportResponse | CategoryExpenseReportResponse
    ): Promise<void> => {
        const calendarIds = [1, 2];
        const query = reportsQueries.report(method, calendarIds, dateFrom(), dateTo());

        expect(query.queryKey).toEqual(QueryKeys.report.byMethod(method, calendarIds, dateFrom(), dateTo()));
        await expectAsync(queryFn<ExpenseReportResponse | CategoryExpenseReportResponse>(query)()).toBeResolvedTo(
            response
        );
    };
});

const calendarIdObjects = (calendarIds: number[]): Calendar[] =>
    calendarIds.map((calendarId: number): Calendar => ({ id: calendarId }) as Calendar);

const dateFrom = (): Date => new Date('2026-01-01T00:00:00');

const dateTo = (): Date => new Date('2026-01-31T00:00:00');

const queryFn = <TData>(query: { queryFn?: unknown }): QueryFn<TData> => query.queryFn as QueryFn<TData>;
