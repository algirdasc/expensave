import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { InputDialogComponent } from '../../../input-dialog/input-dialog.component';

@Component({
    selector: 'app-expense-dialog-description-list-item',
    template: `<nb-list-item (click)="addDescription()" class="actionable border-0">
        <nb-icon icon="file-text-outline" class="me-3"></nb-icon>
        <div class="text-truncate">{{ description ?? 'Add description' }}</div>
    </nb-list-item>`,
    standalone: false
})
export class DescriptionListItemComponent {
    @Input({ required: true })
    public description: string;

    @Output()
    public descriptionChange: EventEmitter<string> = new EventEmitter<string>();

    public constructor(private dialogService: NbDialogService) {}

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
