import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Calendar} from '../../../../../api/entities/calendar.entity';

@Component({
    templateUrl: 'calendar-edit.component.html',
    styleUrls: ['calendar-edit.component.scss'],
    selector: 'app-calendar-edit',
})
export class CalendarEditComponent {
    @Input() public saveButtonEnabled: boolean = true;
    @Input() public calendar: Calendar;
    @Output() public save: EventEmitter<Calendar> = new EventEmitter<Calendar>();
    @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();

    onTagRemove(event): void {
        // TODO:
    }

    onTagAdd(event): void {
        // TODO:
    }
}
