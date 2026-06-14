import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Calendar } from './objects/calendar';
import { User, UserRole } from './objects/user';
import { PasswordRequest } from './request/password.request';

export interface TemporaryPasswordResponse {
    password: string;
}

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

    public adminList(): Observable<User[]> {
        return this.http
            .get('/admin/users')
            .pipe(map(response => plainToInstance(User, <User[]>response, { excludeExtraneousValues: true })));
    }

    public updateRole(user: User, role: UserRole): Observable<User> {
        return this.http
            .put(`/admin/users/${user.id}/role`, { role })
            .pipe(map((response: HttpResponse<User>) => this.convertToType(response)));
    }

    public activate(user: User): Observable<User> {
        return this.http
            .put(`/admin/users/${user.id}/activate`, {})
            .pipe(map((response: HttpResponse<User>) => this.convertToType(response)));
    }

    public deactivate(user: User): Observable<User> {
        return this.http
            .put(`/admin/users/${user.id}/deactivate`, {})
            .pipe(map((response: HttpResponse<User>) => this.convertToType(response)));
    }

    public sendPasswordReset(user: User): Observable<void> {
        return this.http.post<void>(`/admin/users/${user.id}/password-reset`, {});
    }

    public resetPassword(user: User): Observable<TemporaryPasswordResponse> {
        return this.http.post<TemporaryPasswordResponse>(`/admin/users/${user.id}/temporary-password`, {});
    }

    private convertToType(response: HttpResponse<User>): User {
        return plainToInstance(User, response, { excludeExtraneousValues: true });
    }
}
