import { Component, effect, inject } from '@angular/core';
import {
    NbButtonModule,
    NbDialogService,
    NbIconModule,
    NbListModule,
    NbRadioModule,
    NbSpinnerModule,
    NbToastrService,
} from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { CalendarEditComponent } from '../../dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { StatementImportService } from '../../services/statement-import.service';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { CalendarQueries } from '../../../../queries/calendar.queries';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { UserQueries } from '../../../../queries/user.queries';
import { MainStore } from '../../main.store';

@Component({
    selector: 'app-sidebar-calendar-list',
    styleUrls: ['calendar-list.component.scss'],
    templateUrl: 'calendar-list.component.html',
    imports: [NbSpinnerModule, NbListModule, NbRadioModule, NbIconModule, NbButtonModule, ShortNumberPipe],
})
export class CalendarListComponent {
    calendarQueries = inject(CalendarQueries);
    userQueries = inject(UserQueries);
    calendarListQuery = injectQuery(() => this.calendarQueries.list());
    userQuery = injectQuery(() => this.userQueries.profile());
    mainStore = inject(MainStore);
    dialogService = inject(NbDialogService);
    toastrService = inject(NbToastrService);
    statementImportService = inject(StatementImportService);
    selectedCalendar: Calendar;
    calendarDeleteMutator = injectMutation(() => {
        return {
            ...this.calendarQueries.delete(),
            onSuccess: (_, calendar) => {
                this.toastrService.success(`Calendar '${calendar.name}' has been deleted`, 'Calendar deleted');

                if (this.mainStore.selectedCalendar().id === calendar.id) {
                    this.mainStore.selectedCalendar.set(null);
                }
            },
        };
    });
    defaultCalendarMutator = injectMutation(() => {
        return {
            ...this.userQueries.defaultCalendar(),
            onSuccess: (_, calendar) => {
                this.toastrService.success(
                    `Calendar '${calendar.name}' is now default`,
                    'You changed your default calendar'
                );
                this.mainStore.selectedCalendar.set(calendar);
            },
        };
    });

    constructor() {
        effect(() => {
            this.selectedCalendar = this.mainStore.selectedCalendar();
        });
    }

    deleteCalendar(calendar: Calendar): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: 'Are you sure you want to delete calendar?',
                },
            })
            .onClose.subscribe((result?: boolean) => {
                if (result) {
                    this.calendarDeleteMutator.mutate(calendar);
                }
            });
    }

    createCalendar(): void {
        this.dialogService.open(CalendarEditComponent, {
            context: {
                calendar: Calendar.create(this.userQuery.data()),
            },
        });
    }

    editCalendar(calendar: Calendar): void {
        this.dialogService.open(CalendarEditComponent, {
            context: {
                calendar: calendar,
            },
        });
    }
}
