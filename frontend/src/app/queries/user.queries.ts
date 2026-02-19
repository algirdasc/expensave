import { inject, Injectable } from '@angular/core';
import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { UserApiService } from '../api/user.api.service';
import { Calendar } from '../api/objects/calendar';

@Injectable()
export class UserQueries {
    userApiService = inject(UserApiService);

    profile() {
        return queryOptions({
            queryKey: ['users'],
            queryFn: () => lastValueFrom(this.userApiService.profile()),
        });
    }

    profiles() {
        return queryOptions({
            queryKey: ['users'],
            queryFn: () => lastValueFrom(this.userApiService.list()),
        });
    }

    defaultCalendar() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (calendar: Calendar) => lastValueFrom(this.userApiService.defaultCalendar(calendar)),
        });
    }
}
