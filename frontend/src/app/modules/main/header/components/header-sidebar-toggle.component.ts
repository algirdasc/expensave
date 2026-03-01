import { Component, inject } from '@angular/core';
import { NbBadgeModule, NbButtonModule, NbIconModule, NbSidebarService } from '@nebular/theme';
import { SIDEBAR_TAG } from '../../main.service';
import { StatementImportService } from '../../services/statement-import.service';

@Component({
    selector: 'app-header-sidebar-toggle',
    template: `
        <div style="position: relative">
            <button
                nbButton
                ghost
                [status]="statementImportService.expenses.length ? 'danger' : 'primary'"
                (click)="toggleSidebar()"
                id="sidebar-toggler">
                <nb-icon icon="menu-2-outline"></nb-icon>
            </button>
            @if (statementImportService.expenses.length) {
                <nb-badge [dotMode]="true" status="danger" position="top right"></nb-badge>
            }
        </div>
    `,
    imports: [NbButtonModule, NbIconModule, NbBadgeModule],
})
export class HeaderSidebarToggleComponent {
    private readonly sidebarService = inject(NbSidebarService);
    protected readonly statementImportService = inject(StatementImportService);

    public toggleSidebar(): void {
        this.sidebarService.toggle(false, SIDEBAR_TAG);
    }
}
