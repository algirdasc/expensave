/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { UserApiService } from '../api/user.api.service';
import { Calendar } from '../api/objects/calendar';
import { User } from '../api/objects/user';
import { QueryKeys } from './query-keys';
import { PasswordRequest } from '../api/request/password.request';

@Injectable({ providedIn: 'root' })
export class UserQueries {
    private userApiService: UserApiService = inject(UserApiService);
    private queryClient: QueryClient = inject(QueryClient);

    // @eslint-
    public profile() {
        return queryOptions({
            queryKey: QueryKeys.user.profile,
            queryFn: (): Promise<User> => lastValueFrom(this.userApiService.profile()),
        });
    }

    public profiles() {
        return queryOptions({
            queryKey: QueryKeys.user.list,
            queryFn: (): Promise<User[]> => lastValueFrom(this.userApiService.list()),
        });
    }

    public defaultCalendar() {
        return mutationOptions({
            mutationKey: ['user', 'default-calendar'],
            mutationFn: (calendar: Calendar): Promise<User> =>
                lastValueFrom(this.userApiService.defaultCalendar(calendar)),
            onSuccess: (): Promise<void[]> =>
                Promise.all([
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.user.profile }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.user.list }),
                ]),
        });
    }

    public changePassword() {
        return mutationOptions({
            mutationKey: ['user', 'change-password'],
            mutationFn: (password: PasswordRequest): Promise<User> =>
                lastValueFrom(this.userApiService.changePassword(password)),
            onSuccess: (user: User): Promise<void> => {
                this.queryClient.setQueryData(QueryKeys.user.profile, user);

                return this.queryClient.invalidateQueries({ queryKey: QueryKeys.user.list });
            },
        });
    }
}
