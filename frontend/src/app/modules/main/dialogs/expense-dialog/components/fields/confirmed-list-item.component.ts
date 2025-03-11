import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-expense-dialog-confirmed-list-item',
    template: `<nb-list-item (click)="confirmedChange.emit(!confirmed)" class="actionable border-0">
        <nb-icon
            [icon]="confirmed ? 'checkmark-circle-2' : 'radio-button-off'"
            [status]="confirmed ? 'primary' : ''"
            [class.active]="confirmed"
            class="me-3"></nb-icon>
        <div>{{ confirmed ? 'Confirmed' : 'Unconfirmed' }}</div>
    </nb-list-item>`,
    standalone: false,
})
export class ConfirmedListItemComponent {
    @Input({ required: true })
    public confirmed: boolean;

    @Output()
    public confirmedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
