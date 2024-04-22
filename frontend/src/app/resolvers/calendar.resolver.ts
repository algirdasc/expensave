import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CalendarApiService} from '../api/calendar.api.service';
import {Calendar} from '../api/objects/calendar';

@Injectable()
export class CalendarResolver  {
    constructor(private readonly calendarApiService: CalendarApiService) { }

    public resolve(): Observable<Calendar[]> {
        return this.calendarApiService.list();
    }
}
