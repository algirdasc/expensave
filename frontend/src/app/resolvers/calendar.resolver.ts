import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarApiService } from '../api/calendar.api.service';
import { Calendar } from '../api/objects/calendar';

@Injectable()
export class CalendarResolver {
    private readonly calendarApiService = inject(CalendarApiService);


    public resolve(): Observable<Calendar[]> {
        return this.calendarApiService.list();
    }
}
