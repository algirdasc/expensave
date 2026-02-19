/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { CalendarApiService } from '../api/calendar.api.service';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Calendar } from '../api/objects/calendar';

@Injectable()
export class CalendarQueries {
    private calendarApiService = inject(CalendarApiService);

    public list(params?: HttpParams) {
        return queryOptions({
            queryKey: ['calendar', { params: params }],
            queryFn: (): Promise<Calendar[]> => lastValueFrom(this.calendarApiService.list(params)),
        });
    }

    public get(calendarId: number) {
        return queryOptions({
            queryKey: ['calendar', { id: calendarId }],
            queryFn: (): Promise<Calendar> => lastValueFrom(this.calendarApiService.get(calendarId)),
        });
    }

    public save() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (data: Calendar): Promise<Calendar> => lastValueFrom(this.calendarApiService.save(data)),
        });
    }

    public delete() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (calendar: Calendar): Promise<Calendar[]> =>
                lastValueFrom(this.calendarApiService.delete(calendar.id)),
        });
    }
}
