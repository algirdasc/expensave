import { Component, inject } from '@angular/core';
import { NbBadgeModule, NbButtonModule, NbIconModule, NbSidebarService } from '@nebular/theme';
import { SIDEBAR_TAG } from '../../main.service';
import { StatementImportService } from '../../services/statement-import.service';

@Component({
    selector: 'app-header-sidebar-toggle',
    template: `
        <div class="sidebar-toggler-shell">
            <button
                nbButton
                type="button"
                class="sidebar-toggler-button"
                [status]="statementImportService.expenses.length ? 'danger' : 'basic'"
                (click)="toggleSidebar()"
                id="sidebar-toggler">
                <nb-icon icon="menu-2-outline"></nb-icon>
            </button>
            @if (statementImportService.expenses.length) {
                <nb-badge [dotMode]="true" status="danger" position="top right"></nb-badge>
            }
        </div>
    `,
    styles: [
        `
            .sidebar-toggler-shell {
                position: relative;
            }

            .sidebar-toggler-button {
                width: 2.75rem;
                min-width: 2.75rem;
                height: 2.75rem;
                padding: 0;
            }
        `,
    ],
    imports: [NbButtonModule, NbIconModule, NbBadgeModule],
})
export class HeaderSidebarToggleComponent {
    protected readonly statementImportService = inject(StatementImportService);

    private readonly sidebarService = inject(NbSidebarService);

    public toggleSidebar(): void {
        this.sidebarService.toggle(false, SIDEBAR_TAG);
    }
}
