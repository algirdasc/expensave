import { Component, inject } from '@angular/core';
import { NbDialogRef, NbSpinnerModule, NbToastrService } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { CalendarQueries } from '../../../../queries/calendar.queries';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { UserQueries } from '../../../../queries/user.queries';

@Component({
    templateUrl: 'calendars-dialog.component.html',
    styleUrls: ['calendars-dialog.component.scss'],
    imports: [NbSpinnerModule, CalendarListComponent, CalendarEditComponent],
})
export class CalendarsDialogComponent {
    public readonly dialogRef = inject<NbDialogRef<CalendarsDialogComponent>>(NbDialogRef);
    public readonly toastrService = inject(NbToastrService);
    public selectedCalendar: Calendar;
    public editableCalendar: Calendar;

    private readonly calendarQueries = inject(CalendarQueries);
    private readonly userQueries = inject(UserQueries);
    private readonly userProfileQuery = injectQuery(() => this.userQueries.profile());
    private readonly calendarListQuery = injectQuery(() => this.calendarQueries.list());
    private readonly saveMutation = injectMutation(() => this.calendarQueries.save());

    public get isBusy(): boolean {
        return (
            this.saveMutation.isPending() || this.calendarListQuery.isFetching() || this.userProfileQuery.isFetching()
        );
    }

    public get calendars(): Calendar[] {
        return this.calendarListQuery.data() ?? [];
    }

    public editCalendar(calendar?: Calendar): void {
        if (calendar) {
            this.editableCalendar = calendar;
            return;
        }

        const user = this.userProfileQuery.data();
        if (!user) {
            return;
        }

        this.editableCalendar = Calendar.create(user);
    }

    public saveCalendar(calendar: Calendar): void {
        this.saveMutation.mutate(calendar, {
            onSuccess: () => {
                this.editableCalendar = undefined;
                this.toastrService.success('Calendar saved successfully', 'Calendar update');
            },
        });
    }
}
