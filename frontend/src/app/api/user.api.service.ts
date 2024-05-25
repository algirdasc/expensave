import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Calendar } from './objects/calendar';
import { User } from './objects/user';
import { PasswordRequest } from './request/password.request';

@Injectable()
export class UserApiService {
    public onBusyChange: Subject<boolean> = new Subject<boolean>();
    private backend: string = '/user';

    constructor(private http: HttpClient) {}

    public profile(): Observable<User> {
        this.onBusyChange.next(true);

        return this.http.get(`${this.backend}/profile`).pipe(
            finalize(() => this.onBusyChange.next(false)),
            map((response: HttpResponse<User>) => this.convertToType(response))
        );
    }

    public changePassword(password: PasswordRequest): Observable<User> {
        this.onBusyChange.next(true);

        return this.http.put(`${this.backend}/change-password`, password).pipe(
            finalize(() => this.onBusyChange.next(false)),
            map((response: HttpResponse<User>) => this.convertToType(response))
        );
    }

    public defaultCalendar(calendar: Calendar): Observable<User> {
        this.onBusyChange.next(true);

        return this.http.put(`${this.backend}/default-calendar/${calendar.id}`, {}).pipe(
            finalize(() => this.onBusyChange.next(false)),
            map((response: HttpResponse<User>) => this.convertToType(response))
        );
    }

    public list(): Observable<User[]> {
        this.onBusyChange.next(true);

        return this.http.get(`${this.backend}`).pipe(
            finalize(() => this.onBusyChange.next(false)),
            map(response => plainToInstance(User, <User[]>response, { excludeExtraneousValues: true }))
        );
    }

    private convertToType(response: HttpResponse<User>): User {
        return plainToInstance(User, response, { excludeExtraneousValues: true });
    }
}
