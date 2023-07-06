import {Injectable} from '@angular/core';
import {AbstractApiService} from './abstract.api.service';
import {Calendar} from './entities/calendar.entity';

@Injectable()
export class CalendarApiService extends AbstractApiService<Calendar> {
  protected backend: string = '/calendar';
  protected entity: any = Calendar;
}
