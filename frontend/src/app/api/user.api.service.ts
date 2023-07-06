import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {plainToInstance} from 'class-transformer';
import {Observable, Subject} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {User} from './entities/user.entity';

@Injectable()
export class UserApiService {
    public onBusyChange: Subject<boolean> = new Subject<boolean>();
    private backend: string = '/user';

    constructor(private http: HttpClient) { }

    public profile(): Observable<User> {
        this.onBusyChange.next(true);

        return this.http.get(`${this.backend}/profile`)
            .pipe(
                finalize(() => this.onBusyChange.next(false)),
                map((response: HttpResponse<User>) => this.responseToType(response))
            );
    }

    public save(entity: User): Observable<User> {
        this.onBusyChange.next(true);
        return this.http.put(`${this.backend}/profile`, entity)
            .pipe(
                finalize(() => this.onBusyChange.next(false)),
                map((response: HttpResponse<User>) => this.responseToType(response))
            );
    }

    private responseToType(response: HttpResponse<object>): User {
        return plainToInstance(User, response, { excludeExtraneousValues: true });
    }
}
