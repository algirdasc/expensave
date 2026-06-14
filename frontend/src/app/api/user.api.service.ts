import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Calendar } from './objects/calendar';
import { User } from './objects/user';
import { PasswordRequest } from './request/password.request';

@Injectable({ providedIn: 'root' })
export class UserApiService {
    private http = inject(HttpClient);
    private backend: string = '/user';

    public profile(): Observable<User> {
        return this.http
            .get(`${this.backend}/profile`)
            .pipe(map((response: HttpResponse<User>) => this.convertToType(response)));
    }

    public changePassword(password: PasswordRequest): Observable<User> {
        return this.http
            .put(`${this.backend}/change-password`, password)
            .pipe(map((response: HttpResponse<User>) => this.convertToType(response)));
    }

    public defaultCalendar(calendar: Calendar): Observable<User> {
        return this.http
            .put(`${this.backend}/default-calendar/${calendar.id}`, {})
            .pipe(map((response: HttpResponse<User>) => this.convertToType(response)));
    }

    public list(): Observable<User[]> {
        return this.http
            .get(`${this.backend}`)
            .pipe(map(response => plainToInstance(User, <User[]>response, { excludeExtraneousValues: true })));
    }

    private convertToType(response: HttpResponse<User>): User {
        return plainToInstance(User, response, { excludeExtraneousValues: true });
    }
}
