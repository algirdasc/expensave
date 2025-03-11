import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService, NbListModule, NbIconModule } from '@nebular/theme';
import { DateUtil } from '../../../../../../util/date.util';
import { DatepickerDialogComponent } from '../../../datepicker-dialog/datepicker-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-expense-dialog-date-list-item',
    template: `<nb-list-item (click)="selectDateTime()" class="actionable border-0">
        <nb-icon icon="calendar-outline" class="me-3"></nb-icon>
        <div class="text-truncate">{{ date | date: 'fullDate' }}</div>
    </nb-list-item>`,
    imports: [NbListModule, NbIconModule, DatePipe],
})
export class DateListItemComponent {
    @Input({ required: true })
    public date: Date;

    @Output()
    public dateChange: EventEmitter<Date> = new EventEmitter<Date>();

    public constructor(private dialogService: NbDialogService) {}

    public selectDateTime(): void {
        this.dialogService
            .open(DatepickerDialogComponent, {
                context: {
                    date: this.date,
                },
            })
            .onClose.subscribe((result?: Date) => {
                if (result) {
                    this.dateChange.emit(DateUtil.setTime(result, this.date));
                }
            });
    }
}
