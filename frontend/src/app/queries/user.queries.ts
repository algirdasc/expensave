/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { UserApiService } from '../api/user.api.service';
import { Calendar } from '../api/objects/calendar';
import { User, UserRole } from '../api/objects/user';
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

    public adminProfiles() {
        return queryOptions({
            queryKey: QueryKeys.user.adminList,
            queryFn: (): Promise<User[]> => lastValueFrom(this.userApiService.adminList()),
        });
    }

    public defaultCalendar() {
        return mutationOptions({
            mutationKey: ['user', 'default-calendar'],
            mutationFn: (calendar: Calendar): Promise<User> =>
                lastValueFrom(this.userApiService.defaultCalendar(calendar)),
            onSuccess: (user: User): Promise<void> => {
                this.queryClient.setQueryData(QueryKeys.user.profile, user);

                return this.queryClient.invalidateQueries({ queryKey: QueryKeys.user.list });
            },
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

    public updateRole() {
        return mutationOptions({
            mutationKey: ['user', 'update-role'],
            mutationFn: ({ user, role }: { user: User; role: UserRole }): Promise<User> =>
                lastValueFrom(this.userApiService.updateRole(user, role)),
            onSuccess: (): Promise<void> => this.invalidateUsers(),
        });
    }

    public activate() {
        return mutationOptions({
            mutationKey: ['user', 'activate'],
            mutationFn: (user: User): Promise<User> => lastValueFrom(this.userApiService.activate(user)),
            onSuccess: (): Promise<void> => this.invalidateUsers(),
        });
    }

    public deactivate() {
        return mutationOptions({
            mutationKey: ['user', 'deactivate'],
            mutationFn: (user: User): Promise<User> => lastValueFrom(this.userApiService.deactivate(user)),
            onSuccess: (): Promise<void> => this.invalidateUsers(),
        });
    }

    public sendPasswordReset() {
        return mutationOptions({
            mutationKey: ['user', 'send-password-reset'],
            mutationFn: (user: User): Promise<void> => lastValueFrom(this.userApiService.sendPasswordReset(user)),
        });
    }

    public resetPassword() {
        return mutationOptions({
            mutationKey: ['user', 'reset-password'],
            mutationFn: (user: User): Promise<string> =>
                lastValueFrom(this.userApiService.resetPassword(user)).then(response => response.password),
        });
    }

    private async invalidateUsers(): Promise<void> {
        await this.queryClient.invalidateQueries({ queryKey: QueryKeys.user.profile });
        await this.queryClient.invalidateQueries({ queryKey: QueryKeys.user.list });
        await this.queryClient.invalidateQueries({ queryKey: QueryKeys.user.adminList });
    }
}
