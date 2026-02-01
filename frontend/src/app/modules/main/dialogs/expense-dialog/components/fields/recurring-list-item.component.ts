import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbListModule, NbIconModule } from '@nebular/theme';

@Component({
    selector: 'app-expense-dialog-recurring-list-item',
    template: `<nb-list-item (click)="toggleRecurring()" class="actionable border-0">
        <nb-icon icon="refresh-outline" class="me-3"></nb-icon>
        <div class="text-truncate">
            {{ getLabel() }}
        </div>
    </nb-list-item>`,
    imports: [NbListModule, NbIconModule],
})
export class RecurringListItemComponent {
    @Input()
    public recurringType: string;

    @Output()
    public recurringTypeChange: EventEmitter<string> = new EventEmitter<string>();

    private types = ['none', 'weekly', 'fortnightly', 'monthly'];

    public getLabel(): string {
        switch (this.recurringType) {
            case 'weekly':
                return 'Weekly';
            case 'fortnightly':
                return 'Fortnightly';
            case 'monthly':
                return 'Monthly';
            default:
                return 'Not recurring';
        }
    }

    public toggleRecurring(): void {
        const currentIndex = this.types.indexOf(this.recurringType || 'none');
        const nextIndex = (currentIndex + 1) % this.types.length;
        this.recurringType = this.types[nextIndex];
        this.recurringTypeChange.emit(this.recurringType === 'none' ? null : this.recurringType);
    }
}
