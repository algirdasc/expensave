import { HttpParams, HttpResponse } from '@angular/common/http';
import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';

export abstract class AbstractEntityApiService<T extends EntityInterface> extends AbstractApiService {
    protected abstract entity: Type<EntityInterface>;

    public list(params?: HttpParams): Observable<T[]> {
        this.changeIsBusy(true);

        return this.http.get(this.backend, { params: params }).pipe(
            finalize(() => this.changeIsBusy(false)),
            map((response: HttpResponse<T[]>) => this.convertToType<T[]>(this.entity, response))
        );
    }

    public get(id: number): Observable<T> {
        this.changeIsBusy(true);

        return this.http.get(`${this.backend}/${id}`).pipe(
            finalize(() => this.changeIsBusy(false)),
            map((response: HttpResponse<T>) => this.convertToType<T>(this.entity, response))
        );
    }

    public save(entity: T): Observable<T> {
        this.changeIsBusy(true);

        const request = entity.id
            ? this.http.put(`${this.backend}/${entity.id}`, entity)
            : this.http.post(this.backend, entity);

        return request.pipe(
            finalize(() => this.changeIsBusy(false)),
            map((response: HttpResponse<T>) => this.convertToType<T>(this.entity, response))
        );
    }

    public delete(id: number): Observable<T[]> {
        this.changeIsBusy(true);

        return this.http.delete(`${this.backend}/${id}`).pipe(
            finalize(() => this.changeIsBusy(false)),
            map((response: HttpResponse<T[]>) => this.convertToType<T[]>(this.entity, response))
        );
    }
}
