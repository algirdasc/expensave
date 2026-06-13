import { Component, inject } from '@angular/core';
import { NbDialogRef, NbSpinnerModule, NbToastrService } from '@nebular/theme';
import { CalendarApiService } from '../../../../api/calendar.api.service';
import { Calendar } from '../../../../api/objects/calendar';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { CalendarQueries } from '../../../../queries/calendar.queries';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { QueryKeys } from '../../../../queries/query-keys';

@Component({
    templateUrl: 'calendars-dialog.component.html',
    styleUrls: ['calendars-dialog.component.scss'],
    imports: [NbSpinnerModule, CalendarListComponent, CalendarEditComponent],
})
export class CalendarsDialogComponent {
    public readonly dialogRef = inject<NbDialogRef<CalendarsDialogComponent>>(NbDialogRef);
    public readonly toastrService = inject(NbToastrService);
    public isSavingBusy: boolean = false;
    public selectedCalendar: Calendar;
    public editableCalendar: Calendar;

    private readonly calendarApiService = inject(CalendarApiService);
    private readonly queryClient = inject(QueryClient);
    private readonly calendarQueries = inject(CalendarQueries);
    private readonly calendarListQuery = injectQuery(() => this.calendarQueries.list());

    public constructor() {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isSavingBusy = isBusy));
    }

    public get isBusy(): boolean {
        return this.isSavingBusy || this.calendarListQuery.isFetching();
    }

    public get calendars(): Calendar[] {
        return this.calendarListQuery.data() ?? [];
    }

    public editCalendar(calendar?: Calendar): void {
        // TODO: create calendar with user
        this.editableCalendar = calendar ?? new Calendar();
    }

    public saveCalendar(calendar: Calendar): void {
        this.calendarApiService.save(calendar).subscribe(() => {
            this.editableCalendar = undefined;
            this.toastrService.success('Calendar deleted successfully', 'Calendar delete');
            this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.lists });
        });
    }
}
