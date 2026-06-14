import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StatementImportApiService } from '../api/statement-import.api.service';
import { Calendar } from '../api/objects/calendar';
import { StatementImportResponse } from '../api/response/statement-import.response';
import { StatementImportQueries } from './statement-import.queries';

type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

type StatementImportPayload = {
    calendar: Calendar;
    formData: FormData;
};

describe('StatementImportQueries', () => {
    let statementImportApiService: jasmine.SpyObj<StatementImportApiService>;
    let statementImportQueries: StatementImportQueries;

    beforeEach(() => {
        statementImportApiService = jasmine.createSpyObj<StatementImportApiService>('StatementImportApiService', [
            'import',
        ]);

        TestBed.configureTestingModule({
            providers: [
                StatementImportQueries,
                { provide: StatementImportApiService, useValue: statementImportApiService },
            ],
        });

        statementImportQueries = TestBed.inject(StatementImportQueries);
    });

    it('imports statements for a calendar through the API service', async (): Promise<void> => {
        const calendar = calendarWithId(7);
        const formData = new FormData();
        const response = new StatementImportResponse();
        const mutation = statementImportQueries.import();

        statementImportApiService.import.and.returnValue(of(response));

        await expectAsync(
            mutationFn<StatementImportResponse, StatementImportPayload>(mutation)({ calendar, formData })
        ).toBeResolvedTo(response);
        expect(statementImportApiService.import).toHaveBeenCalledOnceWith(calendar, formData);
    });
});

const calendarWithId = (id: number): Calendar => {
    const calendar = new Calendar();
    calendar.id = id;

    return calendar;
};

const mutationFn = <TData, TVariables>(mutation: { mutationFn?: unknown }): MutationFn<TData, TVariables> =>
    mutation.mutationFn as MutationFn<TData, TVariables>;
