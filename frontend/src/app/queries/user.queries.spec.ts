import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { UserApiService } from '../api/user.api.service';
import { Calendar } from '../api/objects/calendar';
import { User } from '../api/objects/user';
import { PasswordRequest } from '../api/request/password.request';
import { QueryKeys } from './query-keys';
import { UserQueries } from './user.queries';

type QueryFn<TData> = () => Promise<TData>;
type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

describe('UserQueries', () => {
    let queryClient: jasmine.SpyObj<QueryClient>;
    let userApiService: jasmine.SpyObj<UserApiService>;
    let userQueries: UserQueries;

    beforeEach(() => {
        queryClient = jasmine.createSpyObj<QueryClient>('QueryClient', ['invalidateQueries', 'setQueryData']);
        queryClient.invalidateQueries.and.resolveTo();
        userApiService = jasmine.createSpyObj<UserApiService>('UserApiService', [
            'activate',
            'adminList',
            'changePassword',
            'deactivate',
            'defaultCalendar',
            'list',
            'profile',
            'resetPassword',
            'sendPasswordReset',
            'updateRole',
        ]);

        TestBed.configureTestingModule({
            providers: [
                UserQueries,
                { provide: QueryClient, useValue: queryClient },
                { provide: UserApiService, useValue: userApiService },
            ],
        });

        userQueries = TestBed.inject(UserQueries);
    });

    it('builds the user profile query and delegates to the API service', async (): Promise<void> => {
        const user = userWithId(1);
        const query = userQueries.profile();

        userApiService.profile.and.returnValue(of(user));

        expect(query.queryKey).toEqual(QueryKeys.user.profile);
        await expectAsync(queryFn<User>(query)()).toBeResolvedTo(user);
        expect(userApiService.profile).toHaveBeenCalledOnceWith();
    });

    it('builds the user list query and delegates to the API service', async (): Promise<void> => {
        const users = [userWithId(1), userWithId(2)];
        const query = userQueries.profiles();

        userApiService.list.and.returnValue(of(users));

        expect(query.queryKey).toEqual(QueryKeys.user.list);
        await expectAsync(queryFn<User[]>(query)()).toBeResolvedTo(users);
        expect(userApiService.list).toHaveBeenCalledOnceWith();
    });

    it('builds the admin user list query and delegates to the API service', async (): Promise<void> => {
        const users = [userWithId(1), userWithId(2)];
        const query = userQueries.adminProfiles();

        userApiService.adminList.and.returnValue(of(users));

        expect(query.queryKey).toEqual(QueryKeys.user.adminList);
        await expectAsync(queryFn<User[]>(query)()).toBeResolvedTo(users);
        expect(userApiService.adminList).toHaveBeenCalledOnceWith();
    });

    it('sets default calendar, updates the profile cache, and invalidates the user list', async (): Promise<void> => {
        const calendar = calendarWithId(7);
        const user = userWithId(3);
        const mutation = userQueries.defaultCalendar();

        userApiService.defaultCalendar.and.returnValue(of(user));

        await expectAsync(mutationFn<User, Calendar>(mutation)(calendar)).toBeResolvedTo(user);
        expect(userApiService.defaultCalendar).toHaveBeenCalledOnceWith(calendar);

        await mutation.onSuccess?.(user, calendar, undefined, undefined);

        expect(queryClient.setQueryData).toHaveBeenCalledOnceWith(QueryKeys.user.profile, user);
        expect(queryClient.invalidateQueries).toHaveBeenCalledOnceWith({ queryKey: QueryKeys.user.list });
    });

    it('changes password, updates the profile cache, and invalidates the user list', async (): Promise<void> => {
        const password = new PasswordRequest();
        const user = userWithId(5);
        const mutation = userQueries.changePassword();

        userApiService.changePassword.and.returnValue(of(user));

        await expectAsync(mutationFn<User, PasswordRequest>(mutation)(password)).toBeResolvedTo(user);
        expect(userApiService.changePassword).toHaveBeenCalledOnceWith(password);

        await mutation.onSuccess?.(user, password, undefined, undefined);

        expect(queryClient.setQueryData).toHaveBeenCalledOnceWith(QueryKeys.user.profile, user);
        expect(queryClient.invalidateQueries).toHaveBeenCalledOnceWith({ queryKey: QueryKeys.user.list });
    });

    it('updates a user role and invalidates user caches', async (): Promise<void> => {
        const user = userWithId(8);
        const updatedUser = userWithId(8);
        updatedUser.role = 'admin';
        const mutation = userQueries.updateRole();

        userApiService.updateRole.and.returnValue(of(updatedUser));

        await expectAsync(
            mutationFn<User, { user: User; role: 'admin' }>(mutation)({ user, role: 'admin' })
        ).toBeResolvedTo(updatedUser);
        expect(userApiService.updateRole).toHaveBeenCalledOnceWith(user, 'admin');

        await mutation.onSuccess?.(updatedUser, { user, role: 'admin' }, undefined, undefined);

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.profile });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.list });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.adminList });
    });

    it('activates a user and invalidates user caches', async (): Promise<void> => {
        const user = userWithId(11);
        const updatedUser = userWithId(11);
        updatedUser.active = true;
        const mutation = userQueries.activate();

        userApiService.activate.and.returnValue(of(updatedUser));

        await expectAsync(mutationFn<User, User>(mutation)(user)).toBeResolvedTo(updatedUser);
        expect(userApiService.activate).toHaveBeenCalledOnceWith(user);

        await mutation.onSuccess?.(updatedUser, user, undefined, undefined);

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.profile });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.list });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.adminList });
    });

    it('deactivates a user and invalidates user caches', async (): Promise<void> => {
        const user = userWithId(12);
        const updatedUser = userWithId(12);
        updatedUser.active = false;
        const mutation = userQueries.deactivate();

        userApiService.deactivate.and.returnValue(of(updatedUser));

        await expectAsync(mutationFn<User, User>(mutation)(user)).toBeResolvedTo(updatedUser);
        expect(userApiService.deactivate).toHaveBeenCalledOnceWith(user);

        await mutation.onSuccess?.(updatedUser, user, undefined, undefined);

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.profile });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.list });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: QueryKeys.user.adminList });
    });

    it('sends a password reset email', async (): Promise<void> => {
        const user = userWithId(9);
        const mutation = userQueries.sendPasswordReset();

        userApiService.sendPasswordReset.and.returnValue(of(undefined));

        await expectAsync(mutationFn<void, User>(mutation)(user)).toBeResolved();
        expect(userApiService.sendPasswordReset).toHaveBeenCalledOnceWith(user);
    });

    it('resets a user password and returns a temporary password', async (): Promise<void> => {
        const user = userWithId(10);
        const mutation = userQueries.resetPassword();

        userApiService.resetPassword.and.returnValue(of({ password: 'temporary-password' }));

        await expectAsync(mutationFn<string, User>(mutation)(user)).toBeResolvedTo('temporary-password');
        expect(userApiService.resetPassword).toHaveBeenCalledOnceWith(user);
    });
});

const calendarWithId = (id: number): Calendar => {
    const calendar = new Calendar();
    calendar.id = id;

    return calendar;
};

const userWithId = (id: number): User => {
    const user = new User();
    user.id = id;

    return user;
};

const queryFn = <TData>(query: { queryFn?: unknown }): QueryFn<TData> => query.queryFn as QueryFn<TData>;

const mutationFn = <TData, TVariables>(mutation: { mutationFn?: unknown }): MutationFn<TData, TVariables> =>
    mutation.mutationFn as MutationFn<TData, TVariables>;
