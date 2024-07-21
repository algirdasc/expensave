/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Injectable()
export abstract class AbstractApiService {
    public onBusyChange: Subject<boolean> = new Subject<boolean>();

    private onBusyChangeTimeout: NodeJS.Timer;

    protected abstract backend: string;

    public constructor(protected http: HttpClient) {}

    public request<K>(method: string, type: any, ...args: any): Observable<K> {
        this.changeIsBusy(true);

        return this.http[method](args[0] ?? this.backend, args[1]).pipe(
            finalize(() => this.changeIsBusy(false)),
            map((response: HttpResponse<K>) => this.convertToType<K>(type, response))
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

    protected idUrl(id?: number): string {
        return id ? `${this.backend}/${id}` : `${this.backend}`;
    }

    protected saveMethod(id?: number): string {
        return id ? 'put' : 'post';
    }
}
