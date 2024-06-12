import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Calendar } from '../../../../../../api/objects/calendar';
import { CalendarsDialogComponent } from '../../../calendars-dialog/calendars-dialog.component';

@Component({
    selector: 'app-expense-dialog-calendar-list-item',
    template: `<nb-list-item
        (click)="selectCalendar()"
        class="actionable border-0"
        [style.height]="textPrefix ? '52px' : null">
        <nb-icon [icon]="icon" class="me-3"></nb-icon>
        <div class="d-block w-100 text-truncate">
            <small *ngIf="textPrefix" class="d-block text-hint">{{ textPrefix }}</small>
            <span *ngIf="!showLoader" [class.text-hint]="!calendar">{{ calendar?.name || 'Select calendar' }}</span>
            <content-loader *ngIf="showLoader" viewBox="0 0 220 10">
                <svg:rect x="0" y="0" rx="5" ry="5" width="220" height="10" />
            </content-loader>
        </div>
    </nb-list-item>`,
})
export class CalendarListItemComponent {
    @Input()
    public calendar: Calendar;

    @Input()
    public textPrefix: string = '';

    @Input()
    public icon: string = 'book-outline';

    @Input()
    public showLoader: boolean = false;

    @Output()
    public calendarChange: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    public constructor(private dialogService: NbDialogService) {}

    public selectCalendar(): void {
        this.dialogService
            .open(CalendarsDialogComponent, {
                context: {
                    selectedCalendar: this.calendar,
                },
            })
            .onClose.subscribe((result?: Calendar) => {
                if (result) {
                    this.calendarChange.emit(result);
                }
            });
    }
}
