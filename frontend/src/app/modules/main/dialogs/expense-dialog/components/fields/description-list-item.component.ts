import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NbDialogService, NbListModule, NbIconModule } from '@nebular/theme';
import { InputDialogComponent } from '../../../input-dialog/input-dialog.component';

@Component({
    selector: 'app-expense-dialog-description-list-item',
    template: `<nb-list-item (click)="addDescription()" class="actionable border-0">
        <nb-icon icon="file-text-outline" class="me-3"></nb-icon>
        <div class="text-truncate">{{ description ?? 'Add description' }}</div>
    </nb-list-item>`,
    imports: [NbListModule, NbIconModule],
})
export class DescriptionListItemComponent {
    private dialogService = inject(NbDialogService);

    @Input({ required: true })
    public description: string;

    @Output()
    public descriptionChange: EventEmitter<string> = new EventEmitter<string>();

    public addDescription(): void {
        this.dialogService
            .open(InputDialogComponent, {
                context: {
                    title: 'Transaction description',
                    text: this.description,
                    placeholder: 'Add details about this transaction',
                },
            })
            .onClose.subscribe((result: string) => {
                if (result !== undefined) {
                    this.descriptionChange.emit(result);
                }
            });
    }
}
