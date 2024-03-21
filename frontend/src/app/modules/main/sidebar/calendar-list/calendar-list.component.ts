import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {CalendarApiService} from '../../../../api/calendar.api.service';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {EntityUtil} from '../../../../util/entity.util';
import {CalendarEditComponent} from '../../dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import {CategoriesDialogComponent} from '../../dialogs/categories-dialog/categories-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {StatementImportDialogComponent} from '../../dialogs/statement-import-dialog/statement-import-dialog.component';

@Component({
    selector: 'app-sidebar-calendar-list',
    styleUrls: ['calendar-list.component.scss'],
    templateUrl: 'calendar-list.component.html'
})
export class CalendarSidebarListComponent {
    @Input() public calendar: Calendar;
    @Output() public calendarsChange: EventEmitter<Calendar[]> = new EventEmitter<Calendar[]>();
    @Output() public calendarChange: EventEmitter<Calendar> = new EventEmitter<Calendar>();
    public isBusy: boolean = false;
    private _calendars: Calendar[] = [];

    constructor(
        public readonly dialogService: NbDialogService,
        public readonly calendarApiService: CalendarApiService
    ) {
        this.calendarApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    @Input()
    get calendars(): Calendar[] {
        return this._calendars;
    }

    set calendars(value: Calendar[]) {
        this._calendars = value;

        const selectedCalendar = this.calendars.find((c: Calendar) => c.id === this.calendar?.id);
        if (!selectedCalendar) {
            this.calendar = this._calendars[0];
            this.calendarChange.emit(this.calendar);
        }
    }

    public importStatement(calendar: Calendar): void {
        this.dialogService
            .open(StatementImportDialogComponent, { autoFocus: true, context: { calendar: calendar } })
            .onClose
            .subscribe((result: boolean) => {
                //if (result) {
                this.calendarChange.emit(this.calendar);
                //}
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
        this.dialogService
            .open(CalendarEditComponent, { context: { calendar: new Calendar() } })
            .onClose
            .subscribe((result?: Calendar) => {
                if (result) {
                    this.fetch();
                }
            })
        ;
    }

    public editCalendar(calendar: Calendar): void {
        this.dialogService
            .open(CalendarEditComponent, { context: { calendar: calendar } })
            .onClose
            .subscribe((result?: Calendar) => {
                if (result) {
                    EntityUtil.replaceInArray(this.calendars, result);
                    this.calendarsChange.emit(this.calendars);
                }
            })
        ;
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

    public manageCategories(): void {
        this.dialogService
            .open(CategoriesDialogComponent, { context: { isSelectable: false } })
            .onClose
            .subscribe(() => {

            })
        ;
    }
}
