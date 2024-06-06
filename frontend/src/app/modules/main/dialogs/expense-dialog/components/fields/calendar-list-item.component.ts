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
        <div class="text-truncate">
            <small *ngIf="textPrefix" class="d-block text-hint">{{ textPrefix }}</small>
            {{ calendar.name }}
        </div>
    </nb-list-item>`,
})
export class CalendarListItemComponent {
    @Input({ required: true })
    public calendar: Calendar;

    @Input()
    public textPrefix: string = '';

    @Input()
    public icon: string = 'book-outline';

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
