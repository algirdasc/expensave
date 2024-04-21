import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CalendarApiService} from '../../../../api/calendar.api.service';
import {Calendar} from '../../../../api/objects/calendar';
import {CalendarEditComponent} from '../../dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {StatementImportDialogComponent} from '../../dialogs/statement-import-dialog/statement-import-dialog.component';
import {MainService} from '../../main.service';

@Component({
    selector: 'app-sidebar-calendar-list',
    styleUrls: ['calendar-list.component.scss'],
    templateUrl: 'calendar-list.component.html'
})
export class CalendarSidebarListComponent implements OnInit {
    @Input() public calendar: Calendar;
    @Output() public calendarChange: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    @Input() public calendars: Calendar[];
    @Output() public calendarsChange: EventEmitter<Calendar[]> = new EventEmitter<Calendar[]>();

    public isBusy: boolean = false;
    private dialogRef: NbDialogRef<CalendarEditComponent>;
    private dialogBack: EventEmitter<boolean> = new EventEmitter<boolean>();
    private dialogSave: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    constructor(
        public readonly dialogService: NbDialogService,
        public readonly mainService: MainService,
        public readonly calendarApiService: CalendarApiService,
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);

        this.dialogBack.subscribe(() => this.dialogRef.close());
        this.dialogSave.subscribe((calendar: Calendar) => {
            this.calendarApiService
                .save(calendar)
                .subscribe((calendar: Calendar) => {
                    this.dialogRef.close(calendar);
                })
        })
    }

    public ngOnInit(): void {
        this.fetch();
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
        this.openCalendarDialog(Calendar.create(this.mainService.user), (calendar: Calendar) => {
            if (calendar !== undefined) {
                this.fetch();
            }
        });
    }

    public editCalendar(calendar: Calendar): void {
        this.calendarApiService
            .get(calendar.id)
            .subscribe((calendar: Calendar) => {
                this.openCalendarDialog(calendar, () => {
                    if (calendar !== undefined) {
                        this.fetch();
                    }
                });
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
        this.dialogRef = this.dialogService
            .open(CalendarEditComponent, {
                context: {
                    calendar: calendar,
                    back: this.dialogBack,
                    save: this.dialogSave,
                }
            });

        this.dialogRef
            .onClose
            .subscribe((calendar: Calendar) => {
                console.log('a', calendar);
                onClose(calendar);
            })
        ;
    }
}
