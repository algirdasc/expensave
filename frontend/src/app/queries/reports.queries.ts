/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Calendar } from '../api/objects/calendar';
import { ReportsApiService } from '../api/reports.api.service';
import { CategoryExpenseReportResponse } from '../api/response/category-expense-report.response';
import { ExpenseReportResponse } from '../api/response/expense-report.response';
import { QueryKeys } from './query-keys';

@Injectable({ providedIn: 'root' })
export class ReportsQueries {
    private readonly reportsApiService = inject(ReportsApiService);

    public categoryExpenses(calendarIds: number[], dateFrom: Date, dateTo: Date) {
        return queryOptions({
            queryKey: QueryKeys.report.categoryExpenses(calendarIds, dateFrom, dateTo),
            queryFn: (): Promise<CategoryExpenseReportResponse> =>
                lastValueFrom(
                    this.reportsApiService.categoryExpenses(this.mapCalendarIds(calendarIds), dateFrom, dateTo)
                ),
        });
    }

    public dailyExpenses(calendarIds: number[], dateFrom: Date, dateTo: Date) {
        return queryOptions({
            queryKey: QueryKeys.report.dailyExpenses(calendarIds, dateFrom, dateTo),
            queryFn: (): Promise<ExpenseReportResponse> =>
                lastValueFrom(this.reportsApiService.dailyExpenses(this.mapCalendarIds(calendarIds), dateFrom, dateTo)),
        });
    }

    public monthlyExpenses(calendarIds: number[], dateFrom: Date, dateTo: Date) {
        return queryOptions({
            queryKey: QueryKeys.report.monthlyExpenses(calendarIds, dateFrom, dateTo),
            queryFn: (): Promise<ExpenseReportResponse> =>
                lastValueFrom(
                    this.reportsApiService.monthlyExpenses(this.mapCalendarIds(calendarIds), dateFrom, dateTo)
                ),
        });
    }

    private mapCalendarIds(calendarIds: number[]): Calendar[] {
        return calendarIds.map((calendarId: number): Calendar => ({ id: calendarId }) as Calendar);
    }
}
