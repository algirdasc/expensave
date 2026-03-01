import { Component, EventEmitter, Output } from '@angular/core';
import { NbButtonGroupModule, NbButtonModule, NbIconModule } from '@nebular/theme';

@Component({
    selector: 'app-header-nav-buttons',
    template: `
        <nb-button-group status="primary" class="d-none d-sm-block mx-3">
            <button nbButton (click)="prev.emit()">
                <nb-icon icon="arrow-back-outline"></nb-icon>
            </button>

            <button nbButton (click)="today.emit()">TODAY</button>

            <button nbButton (click)="next.emit()">
                <nb-icon icon="arrow-forward-outline"></nb-icon>
            </button>
        </nb-button-group>
    `,
    imports: [NbButtonGroupModule, NbButtonModule, NbIconModule],
})
export class HeaderNavButtonsComponent {
    @Output() public prev = new EventEmitter<void>();
    @Output() public next = new EventEmitter<void>();
    @Output() public today = new EventEmitter<void>();
}
