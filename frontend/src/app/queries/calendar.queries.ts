/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { CalendarApiService } from '../api/calendar.api.service';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Calendar } from '../api/objects/calendar';
import { QueryKeys } from './query-keys';
import { CalendarExpenseListResponse } from '../api/response/calendar-expense-list.response';

@Injectable({ providedIn: 'root' })
export class CalendarQueries {
    private calendarApiService = inject(CalendarApiService);
    private queryClient = inject(QueryClient);

    public list(params?: HttpParams) {
        return queryOptions({
            queryKey: QueryKeys.calendar.list(params),
            queryFn: (): Promise<Calendar[]> => lastValueFrom(this.calendarApiService.list(params)),
        });
    }

    public get(calendarId: number) {
        return queryOptions({
            queryKey: QueryKeys.calendar.detail(calendarId),
            queryFn: (): Promise<Calendar> => lastValueFrom(this.calendarApiService.get(calendarId)),
        });
    }

    public expenseList(calendarId: number, dateFrom: Date, dateTo: Date) {
        return queryOptions({
            queryKey: QueryKeys.calendar.expenseList(calendarId, dateFrom, dateTo),
            queryFn: (): Promise<CalendarExpenseListResponse> =>
                lastValueFrom(this.calendarApiService.listExpensesById(calendarId, dateFrom, dateTo)),
        });
    }

    public save() {
        return mutationOptions({
            mutationKey: ['calendar', 'save'],
            mutationFn: (data: Calendar): Promise<Calendar> => lastValueFrom(this.calendarApiService.save(data)),
            onSuccess: (calendar: Calendar): Promise<void[]> =>
                Promise.all([
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.lists }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.detail(calendar.id) }),
                ]),
        });
    }

    public delete() {
        return mutationOptions({
            mutationKey: ['calendar', 'delete'],
            mutationFn: (calendar: Calendar): Promise<Calendar[]> =>
                lastValueFrom(this.calendarApiService.delete(calendar.id)),
            onSuccess: (_response: Calendar[], calendar: Calendar): Promise<void[]> =>
                Promise.all([
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.lists }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.detail(calendar.id) }),
                ]),
        });
    }
}
