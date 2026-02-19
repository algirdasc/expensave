/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { UserApiService } from '../api/user.api.service';
import { Calendar } from '../api/objects/calendar';
import { User } from '../api/objects/user';

@Injectable()
export class UserQueries {
    private userApiService: UserApiService = inject(UserApiService);

    // @eslint-
    public profile() {
        return queryOptions({
            queryKey: ['users'],
            queryFn: (): Promise<User> => lastValueFrom(this.userApiService.profile()),
        });
    }

    public profiles() {
        return queryOptions({
            queryKey: ['users'],
            queryFn: (): Promise<User[]> => lastValueFrom(this.userApiService.list()),
        });
    }

    public defaultCalendar() {
        return mutationOptions({
            mutationKey: ['calendar'],
            mutationFn: (calendar: Calendar): Promise<User> =>
                lastValueFrom(this.userApiService.defaultCalendar(calendar)),
        });
    }
}
