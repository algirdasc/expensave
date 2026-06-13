/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { inject, Injectable } from '@angular/core';
import { mutationOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Calendar } from '../api/objects/calendar';
import { StatementImportResponse } from '../api/response/statement-import.response';
import { StatementImportApiService } from '../api/statement-import.api.service';

type StatementImportPayload = {
    calendar: Calendar;
    formData: FormData;
};

@Injectable({ providedIn: 'root' })
export class StatementImportQueries {
    private readonly statementImportApiService = inject(StatementImportApiService);

    public import() {
        return mutationOptions({
            mutationKey: ['statement-import', 'import'],
            mutationFn: ({ calendar, formData }: StatementImportPayload): Promise<StatementImportResponse> =>
                lastValueFrom(this.statementImportApiService.import(calendar, formData)),
        });
    }
}
