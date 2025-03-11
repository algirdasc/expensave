import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { CalendarApiService } from '../../../../../api/calendar.api.service';
import { Calendar } from '../../../../../api/objects/calendar';
import { UserApiService } from '../../../../../api/user.api.service';
import { CalendarEditComponent } from '../../../dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MainService } from '../../../main.service';
import { StatementImportService } from '../../../services/statement-import.service';

@Component({
    selector: 'app-sidebar-calendar-list',
    styleUrls: ['calendar-list.component.scss'],
    templateUrl: 'calendar-list.component.html',
    standalone: false
})
export class CalendarSidebarListComponent {
    @Input() public calendar: Calendar;
    @Output() public calendarChange: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    @Input() public calendars: Calendar[];
    @Output() public calendarsChange: EventEmitter<Calendar[]> = new EventEmitter<Calendar[]>();

    public isBusy: boolean = false;
    private dialogRef: NbDialogRef<CalendarEditComponent>;
    private dialogBack: EventEmitter<boolean> = new EventEmitter<boolean>();
    private dialogSave: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    public constructor(
        public readonly dialogService: NbDialogService,
        public readonly mainService: MainService,
        public readonly calendarApiService: CalendarApiService,
        public readonly userApiService: UserApiService,
        public readonly toastrService: NbToastrService,
        public readonly statementImportService: StatementImportService
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));

        this.dialogBack.subscribe(() => this.dialogRef.close());
        this.dialogSave.subscribe((calendar: Calendar) => {
            this.calendarApiService.save(calendar).subscribe((calendar: Calendar) => {
                this.toastrService.success('Calendar saved successfully', 'Calendar update');
                this.dialogRef.close(calendar);
            });
        });
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
                    this.calendarApiService.delete(calendar.id).subscribe(() => {
                        this.toastrService.success('Calendar deleted successfully', 'Calendar delete');
                        this.fetch();
                    });
                }
            });
    }

    public makeDefault(calendar: Calendar): void {
        this.userApiService.defaultCalendar(calendar).subscribe(() => {
            this.calendarChange.emit(calendar);
            this.toastrService.success(
                `Calendar '${calendar.name}' is now default`,
                'You changed your default calendar'
            );
        });
    }

    public createCalendar(): void {
        this.openCalendarDialog(Calendar.create(this.mainService.user));
    }

    public editCalendar(calendar: Calendar): void {
        this.calendarApiService.get(calendar.id).subscribe((calendar: Calendar) => this.openCalendarDialog(calendar));
    }

    public fetch(): void {
        this.calendarApiService.list().subscribe((calendars: Calendar[]) => {
            this.calendars = calendars;
            this.calendarsChange.emit(this.calendars);
        });
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
