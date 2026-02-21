import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbBadgeModule, NbButtonModule, NbIconModule } from '@nebular/theme';

@Component({
    selector: 'app-sidebar-toggle',
    templateUrl: 'sidebar-toggle.component.html',
    styleUrl: 'sidebar-toggle.component.scss',
    imports: [NbButtonModule, NbIconModule, NbBadgeModule],
})
export class SidebarToggleComponent {
    @Input()
    public hasNotifications: boolean = false;

    @Output()
    public sidebarToggle: EventEmitter<void> = new EventEmitter<void>();

    public onToggle(): void {
        this.sidebarToggle.emit();
    }
}
