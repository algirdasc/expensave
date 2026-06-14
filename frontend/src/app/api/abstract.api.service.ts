/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export abstract class AbstractApiService {
    protected http: HttpClient = inject(HttpClient);

    protected abstract backend: string;

    public request<K>(method: string, type: any, ...args: any): Observable<K> {
        return this.http[method](args[0] ?? this.backend, args[1]).pipe(
            map((response: HttpResponse<K>) => this.convertToType<K>(type, response))
        );
    }

    protected convertToType<K>(type: any, response: HttpResponse<K>): K {
        return plainToInstance(type, response, { excludeExtraneousValues: true });
    }

    protected idUrl(id?: number): string {
        return id ? `${this.backend}/${id}` : `${this.backend}`;
    }

    protected saveMethod(id?: number): string {
        return id ? 'put' : 'post';
    }
}
