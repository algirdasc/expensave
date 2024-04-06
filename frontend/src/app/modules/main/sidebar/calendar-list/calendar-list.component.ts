import {Component, EventEmitter, Input, Output,} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {CalendarApiService} from '../../../../api/calendar.api.service';
import {Calendar} from '../../../../api/objects/calendar';
import {CalendarEditComponent} from '../../dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {StatementImportDialogComponent} from '../../dialogs/statement-import-dialog/statement-import-dialog.component';

@Component({
    selector: 'app-sidebar-calendar-list',
    styleUrls: ['calendar-list.component.scss'],
    templateUrl: 'calendar-list.component.html'
})
export class CalendarSidebarListComponent {
    @Input() public calendar: Calendar;
    @Output() public calendarChange: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    @Input() public calendars: Calendar[];
    @Output() public calendarsChange: EventEmitter<Calendar[]> = new EventEmitter<Calendar[]>();

    public isBusy: boolean = false;

    constructor(
        public readonly dialogService: NbDialogService,
        public readonly calendarApiService: CalendarApiService
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public importStatement(calendar: Calendar): void {
        this.dialogService
            .open(StatementImportDialogComponent, { autoFocus: true, context: { calendar: calendar } })
            .onClose
            .subscribe((result: boolean) => {
                if (result) {
                    this.calendarChange.emit(this.calendar);
                }
            })
        ;
    }

    public deleteCalendar(calendar: Calendar): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                autoFocus: true,
                context: {
                    question: 'Are you sure you want to delete calendar?'
                }
            })
            .onClose
            .subscribe((result?: boolean) => {
                if (result) {
                    this.calendarApiService
                        .delete(calendar.id)
                        .subscribe((calendars: Calendar[]) => {
                            this.calendars = calendars;
                            this.calendarsChange.emit(this.calendars);
                        })
                    ;
                }
            });
    }

    public createCalendar(): void {
        this.openCalendarDialog(new Calendar(), () => {});

        // this.dialogService
        //     .open(CalendarEditComponent, { context: { calendar: new Calendar() } })
        //     .onClose
        //     .subscribe((result?: Calendar) => {
        //         if (result) {
        //             this.fetch();
        //         }
        //     })
        // ;
    }

    public editCalendar(calendar: Calendar): void {
        this.calendarApiService
            .get(calendar.id)
            .subscribe((calendar: Calendar) => {
                this.openCalendarDialog(calendar, () => this.fetch()); // TODO: .fetchExpenses());
            });
    }

    public fetch(): void {
        this.calendarApiService
            .list()
            .subscribe((calendars: Calendar[]) => {
                this.calendars = calendars;
                this.calendarsChange.emit(this.calendars);
            })
        ;
    }

    private openCalendarDialog(calendar: Calendar, onClose: (calendar: Calendar) => void): void {
        this.dialogService
            .open(CalendarEditComponent, {
                context: {
                    calendar: calendar,
                }
            })
            .onClose
            .subscribe((calendar: Calendar) => {
                onClose(calendar);
            })
        ;
    }
}
