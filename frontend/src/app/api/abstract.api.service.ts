import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {plainToClass, plainToInstance} from 'class-transformer';
import {Observable, Subject} from 'rxjs';
import {delay, finalize, map, tap} from 'rxjs/operators';
import {EntityInterface} from './entities/entity.interface';

@Injectable()
export abstract class AbstractApiService<T extends EntityInterface> {
    public onBusyChange: Subject<boolean> = new Subject<boolean>();
    protected abstract backend: string;
    protected abstract entity: any;
    private onBusyChangeTimeout: number;

    constructor(protected http: HttpClient) {
    }

    public list(...args: any): Observable<T[]> {
        this.changeIsBusy(true);

        return this.http
            .get(args[0] ?? this.backend)
            .pipe(
                finalize(() => this.changeIsBusy(false)),
                map((response: HttpResponse<object[]>) => this.responseArrayToType(response))
            );
    }

    public get(id: number): Observable<T> {
        this.changeIsBusy(true);

        return this.http
            .get(`${this.backend}/${id}`)
            .pipe(
                finalize(() => this.changeIsBusy(false)),
                map((response: HttpResponse<object>) => this.responseToType(response))
            );
    }

    public save(entity: T): Observable<T> {
        this.changeIsBusy(true);

        const request = entity.id
            ? this.http.put(`${this.backend}/${entity.id}`, entity)
            : this.http.post(this.backend, entity)
        ;

        return request.pipe(
            finalize(() => this.changeIsBusy(false)),
            map((response: HttpResponse<object>) => this.responseToType(response))
        );
    }

    public delete(id: number): Observable<any> {
        this.changeIsBusy(true);

        return this.http
            .delete(`${this.backend}/${id}`)
            .pipe(
                finalize(() => this.changeIsBusy(false)),
                map((response: HttpResponse<object[]>) => this.responseToType(response))
            );
    }

    protected responseToType(response: HttpResponse<object>): T {
        return plainToInstance(this.entity, response, { excludeExtraneousValues: true });
    }

    protected responseArrayToType(response: HttpResponse<object[]>): T[] {
        return plainToInstance(this.entity, response, { excludeExtraneousValues: true });
    }

    protected changeIsBusy(isBusy: boolean): void {
        clearTimeout(this.onBusyChangeTimeout);

        if (!isBusy) {
            return this.onBusyChange.next(isBusy);
        }

        this.onBusyChangeTimeout = setTimeout(() => this.onBusyChange.next(isBusy), 750);
    }
}