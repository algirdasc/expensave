import { inject, Injectable } from '@angular/core';
import { ReportsApiService } from '../api/reports.api.service';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Calendar } from '../api/objects/calendar';
import { CategoryExpenseReportResponse } from '../api/response/category-expense-report.response';

@Injectable()
export class ReportQueries {
    reportApiService = inject(ReportsApiService);

    categoryExpenses(calendars: Calendar[], dateFrom: Date, dateTo: Date) {
        return queryOptions({
            queryKey: [
                'expenses',
                { calendarIds: calendars.map((calendar: Calendar) => calendar.id), dateFrom: dateFrom, dateTo: dateTo },
            ],
            queryFn: (): Promise<CategoryExpenseReportResponse> =>
                lastValueFrom(this.reportApiService.categoryExpenses(calendars, dateFrom, dateTo)),
        });
    }
}
