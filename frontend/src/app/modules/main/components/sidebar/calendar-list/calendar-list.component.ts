import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
    NbButtonModule,
    NbDialogRef,
    NbDialogService,
    NbIconModule,
    NbListModule,
    NbRadioModule,
    NbSpinnerModule,
    NbToastrService,
} from '@nebular/theme';
import { Calendar } from '../../../../../api/objects/calendar';
import { CalendarQueries } from '../../../../../queries/calendar.queries';
import { UserQueries } from '../../../../../queries/user.queries';
import { CalendarEditComponent } from '../../../dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MainService } from '../../../main.service';
import { StatementImportService } from '../../../services/statement-import.service';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

@Component({
    selector: 'app-sidebar-calendar-list',
    styleUrls: ['calendar-list.component.scss'],
    templateUrl: 'calendar-list.component.html',
    imports: [NbSpinnerModule, NbListModule, NbRadioModule, NbIconModule, NbButtonModule, ShortNumberPipe],
})
export class CalendarSidebarListComponent implements OnChanges {
    @Input() public calendar: Calendar;
    @Output() public readonly calendarChange: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    @Input() public calendars: Calendar[];
    @Output() public readonly calendarsChange: EventEmitter<Calendar[]> = new EventEmitter<Calendar[]>();

    public readonly dialogService = inject(NbDialogService);
    public readonly mainService = inject(MainService);
    public readonly toastrService = inject(NbToastrService);
    public readonly statementImportService = inject(StatementImportService);
    public selectedCalendarId: number | null = null;

    private readonly calendarQueries = inject(CalendarQueries);
    private readonly userQueries = inject(UserQueries);
    private readonly queryClient = inject(QueryClient);
    private dialogRef: NbDialogRef<CalendarEditComponent>;
    private dialogBack: EventEmitter<boolean> = new EventEmitter<boolean>();
    private dialogSave: EventEmitter<Calendar> = new EventEmitter<Calendar>();
    private isFetchingBusy = false;
    private readonly saveMutation = injectMutation(() => this.calendarQueries.save());
    private readonly deleteMutation = injectMutation(() => this.calendarQueries.delete());
    private readonly defaultCalendarMutation = injectMutation(() => this.userQueries.defaultCalendar());

    public constructor() {
        this.dialogBack.subscribe(() => this.dialogRef.close());
        this.dialogSave.subscribe((calendar: Calendar) => {
            this.saveMutation.mutate(calendar, {
                onSuccess: (response: Calendar) => {
                    this.toastrService.success('Calendar saved successfully', 'Calendar update');
                    this.dialogRef.close(response);
                },
            });
        });
    }

    public get isBusy(): boolean {
        return (
            this.saveMutation.isPending() ||
            this.deleteMutation.isPending() ||
            this.defaultCalendarMutation.isPending() ||
            this.isFetchingBusy
        );
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.calendar) {
            this.selectedCalendarId = changes.calendar.currentValue?.id ?? null;
        }
    }

    public deleteCalendar(calendar: Calendar): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: 'Are you sure you want to delete calendar?',
                },
            })
            .onClose.subscribe((result?: boolean) => {
                if (result) {
                    this.deleteMutation.mutate(calendar, {
                        onSuccess: () => {
                            this.toastrService.success('Calendar deleted successfully', 'Calendar delete');
                            this.fetch();
                        },
                    });
                }
            });
    }

    public makeDefault(calendar: Calendar): void {
        this.defaultCalendarMutation.mutate(calendar, {
            onSuccess: () => {
                this.calendarChange.emit(calendar);
                this.toastrService.success(
                    `Calendar '${calendar.name}' is now default`,
                    'You changed your default calendar'
                );
            },
        });
    }

    public createCalendar(): void {
        this.openCalendarDialog(Calendar.create(this.mainService.user));
    }

    public editCalendar(calendar: Calendar): void {
        this.isFetchingBusy = true;

        void this.queryClient
            .fetchQuery(this.calendarQueries.get(calendar.id))
            .then((response: Calendar) => this.openCalendarDialog(response))
            .catch(() => undefined)
            .finally(() => (this.isFetchingBusy = false));
    }

    public fetch(): void {
        this.isFetchingBusy = true;

        void this.queryClient
            .fetchQuery(this.calendarQueries.list())
            .then((calendars: Calendar[]) => {
                this.calendars = calendars;
                this.calendarsChange.emit(this.calendars);
            })
            .catch(() => undefined)
            .finally(() => (this.isFetchingBusy = false));
    }

    private openCalendarDialog(calendar: Calendar, onClose?: (calendar: Calendar) => void): void {
        this.dialogRef = this.dialogService.open(CalendarEditComponent, {
            context: {
                calendar: calendar,
                back: this.dialogBack,
                save: this.dialogSave,
            },
        });

        this.dialogRef.onClose.subscribe((calendar: Calendar) => {
            if (onClose !== undefined) {
                onClose(calendar);
            }

            if (calendar !== undefined) {
                this.fetch();
            }
        });
    }
}
