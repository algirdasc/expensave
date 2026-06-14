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
            'changePassword',
            'defaultCalendar',
            'list',
            'profile',
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
