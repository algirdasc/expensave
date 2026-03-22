import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
    NbButtonModule,
    NbDialogRef,
    NbDialogService,
    NbIconModule,
    NbToastrService,
} from '@nebular/theme';
import { CalendarApiService } from '../../../../../api/calendar.api.service';
import { Calendar } from '../../../../../api/objects/calendar';
import { User } from '../../../../../api/objects/user';
import { CalendarEditComponent } from '../../../dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-sidebar-calendar-list-actions',
    template: `
        <div class="d-flex justify-content-between">
            <button nbButton fullWidth status="primary" ghost (click)="createCalendar()" class="pl-4" i18n>
                <nb-icon icon="plus"></nb-icon>
                Add a calendar...
            </button>
        </div>
    `,
    imports: [NbButtonModule, NbIconModule],
})
export class CalendarListActionsComponent {
    @Input({ required: true }) public user: User;

    @Output() public calendarsChange = new EventEmitter<Calendar[]>();

    private readonly dialogService = inject(NbDialogService);
    private readonly calendarApiService = inject(CalendarApiService);
    private readonly toastrService = inject(NbToastrService);

    private dialogRef: NbDialogRef<CalendarEditComponent>;
    private readonly dialogBack = new EventEmitter<boolean>();
    private readonly dialogSave = new EventEmitter<Calendar>();

    public constructor() {
        this.dialogBack.subscribe(() => this.dialogRef.close());
        this.dialogSave.subscribe((calendar: Calendar) => {
            this.calendarApiService.save(calendar).subscribe((saved: Calendar) => {
                this.toastrService.success('Calendar saved successfully', 'Calendar update');
                this.dialogRef.close(saved);
            });
        });
    }

    public createCalendar(): void {
        this.openCalendarDialog(Calendar.create(this.user));
    }

    public editCalendar(calendar: Calendar): void {
        this.calendarApiService.get(calendar.id).subscribe((cal: Calendar) => this.openCalendarDialog(cal));
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
                        this.fetchCalendars();
                    });
                }
            });
    }

    private fetchCalendars(): void {
        this.calendarApiService.list().subscribe((calendars: Calendar[]) => {
            this.calendarsChange.emit(calendars);
        });
    }

    private openCalendarDialog(calendar: Calendar): void {
        this.dialogRef = this.dialogService.open(CalendarEditComponent, {
            context: {
                calendar,
                back: this.dialogBack,
                save: this.dialogSave,
            },
        });

        this.dialogRef.onClose.subscribe((cal: Calendar) => {
            if (cal !== undefined) {
                this.fetchCalendars();
            }
        });
    }
}
