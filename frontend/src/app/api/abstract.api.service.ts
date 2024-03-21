/* eslint-disable @typescript-eslint/no-explicit-any */
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {plainToInstance} from 'class-transformer';
import {Observable, Subject} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {EntityInterface} from './entities/entity.interface';

@Injectable()
export abstract class AbstractApiService<T extends EntityInterface> {
    public onBusyChange: Subject<boolean> = new Subject<boolean>();
    protected abstract backend: string;
    protected abstract entity: any;
    private onBusyChangeTimeout: NodeJS.Timer;

    constructor(protected http: HttpClient) {
    }

    public request<K>(method: string, type: any,...args: any): Observable<K> {
        this.changeIsBusy(true);

        return this.http[method](args[0] ?? this.backend, args[1])
            .pipe(
                finalize(() => this.changeIsBusy(false)),
                map((response: HttpResponse<K>) => this.convertToType<K>(type, response))
            );
    }

    public list(...args: any): Observable<T[]> {
        this.changeIsBusy(true);

        return this.http
            .get(args[0] ?? this.backend)
            .pipe(
                finalize(() => this.changeIsBusy(false)),
                map((response: HttpResponse<T[]>) => this.convertToType<T[]>(this.entity, response))
            );
    }

    public get(id: number): Observable<T> {
        this.changeIsBusy(true);

        return this.http
            .get(`${this.backend}/${id}`)
            .pipe(
                finalize(() => this.changeIsBusy(false)),
                map((response: HttpResponse<T>) => this.convertToType<T>(this.entity, response))
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
            map((response: HttpResponse<T>) => this.convertToType<T>(this.entity, response))
        );
    }

    public delete(id: number): Observable<T[]> {
        this.changeIsBusy(true);

        return this.http
            .delete(`${this.backend}/${id}`)
            .pipe(
                finalize(() => this.changeIsBusy(false)),
                map((response: HttpResponse<T[]>) => this.convertToType<T[]>(this.entity, response))
            );
    }

    protected convertToType<K>(type: any, response: HttpResponse<K>): K {
        return plainToInstance(type, response, { excludeExtraneousValues: true });
    }

    protected changeIsBusy(isBusy: boolean): void {
        clearTimeout(this.onBusyChangeTimeout);

        if (!isBusy) {
            return this.onBusyChange.next(isBusy);
        }

        this.onBusyChangeTimeout = setTimeout(() => this.onBusyChange.next(isBusy), 750);
    }
}
