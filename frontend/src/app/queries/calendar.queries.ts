import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { CalendarApiService } from '../api/calendar.api.service';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Calendar } from '../api/objects/calendar';

@Injectable()
export class CalendarQueries {
    calendarApiService = inject(CalendarApiService);

    list(params?: HttpParams) {
        return queryOptions({
            queryKey: ['calendar', { params: params }],
            queryFn: () => lastValueFrom(this.calendarApiService.list(params)),
        });
    }

    get(calendarId: number) {
        return queryOptions({
            queryKey: ['calendar', { id: calendarId }],
            queryFn: () => lastValueFrom(this.calendarApiService.get(calendarId)),
        });
    }

    save() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (data: Calendar) => lastValueFrom(this.calendarApiService.save(data)),
        });
    }

    delete() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (calendar: Calendar) => lastValueFrom(this.calendarApiService.delete(calendar.id)),
        });
    }
}
