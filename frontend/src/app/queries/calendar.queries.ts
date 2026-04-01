/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { CalendarApiService } from '../api/calendar.api.service';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Calendar } from '../api/objects/calendar';
import { CalendarExpenseListResponse } from '../api/response/calendar-expense-list.response';
import { DateUtil } from '../util/date.util';
import { NbDateService } from '@nebular/theme';

@Injectable()
export class CalendarQueries {
    queryClient = inject(QueryClient);
    calendarApiService = inject(CalendarApiService);
    dateService = inject(NbDateService);

    list(params?: HttpParams) {
        return queryOptions({
            queryKey: ['calendar', { params: params }],
            queryFn: (): Promise<Calendar[]> => lastValueFrom(this.calendarApiService.list(params)),
        });
    }

    listExpenses(calendar: Calendar, dateFrom: Date, dateTo: Date) {
        const formattedDateFrom = this.dateService.format(dateFrom, DateUtil.DATE_FORMAT);
        const formattedDateTo = this.dateService.format(dateTo, DateUtil.DATE_FORMAT);

        return queryOptions({
            queryKey: [
                'calendar_expenses',
                { calendar: calendar.id, dateFrom: formattedDateFrom, dateTo: formattedDateTo },
            ],
            queryFn: (): Promise<CalendarExpenseListResponse> =>
                lastValueFrom(this.calendarApiService.listExpenses(calendar, dateFrom, dateTo)),
            enabled: !!calendar && !!dateFrom && !!dateTo,
        });
    }

    get(calendarId: number) {
        return queryOptions({
            queryKey: ['calendar', { id: calendarId }],
            queryFn: (): Promise<Calendar> => lastValueFrom(this.calendarApiService.get(calendarId)),
        });
    }

    save() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (data: Calendar): Promise<Calendar> => lastValueFrom(this.calendarApiService.save(data)),
        });
    }

    delete() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (calendar: Calendar): Promise<Calendar[]> =>
                lastValueFrom(this.calendarApiService.delete(calendar.id)),
            onSuccess: () => {
                this.queryClient.invalidateQueries({ queryKey: ['calendar'] });
                this.queryClient.invalidateQueries({ queryKey: ['calendar_expenses'] });
            },
        });
    }
}
