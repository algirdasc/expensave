import {Injectable} from '@angular/core';
import {Calendar} from '../../api/objects/calendar';
import {User} from '../../api/objects/user';

@Injectable()
export class ReportsService {
    public user: User;
    public calendars: Calendar[];
}
