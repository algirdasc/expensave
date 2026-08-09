import { Component, inject } from '@angular/core';
import { NbButtonModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { MainService } from '../../main.service';

@Component({
    selector: 'app-header-search',
    template: `
        <nb-form-field class="header-search-field">
            <nb-icon nbPrefix icon="search-outline" />
            <input
                nbInput
                fullWidth
                type="text"
                placeholder="Search expenses"
                aria-label="Search expenses by name, description or amount"
                [value]="mainService.searchQuery"
                (input)="onSearch($event)" />
            @if (mainService.searchQuery) {
                <button nbSuffix nbButton ghost type="button" aria-label="Clear search" (click)="clearSearch()">
                    <nb-icon icon="close-outline" />
                </button>
            }
        </nb-form-field>
    `,
    styles: [
        `
            :host {
                min-width: 0;
            }

            .header-search-field {
                width: 100%;
            }
        `,
    ],
    imports: [NbFormFieldModule, NbInputModule, NbIconModule, NbButtonModule],
})
export class HeaderSearchComponent {
    protected readonly mainService = inject(MainService);

    protected onSearch(event: Event): void {
        this.mainService.searchQuery = (event.target as HTMLInputElement).value;
    }

    protected clearSearch(): void {
        this.mainService.searchQuery = '';
    }
}
