import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NbDialogService, NbListModule, NbIconModule } from '@nebular/theme';
import { Category } from '../../../../../../api/objects/category';
import { CategoriesDialogComponent } from '../../../categories-dialog/categories-dialog.component';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-expense-dialog-category-list-item',
    template: `<nb-list-item (click)="selectCategory()" class="border-0" [class.actionable]="isActionable">
        <nb-icon icon="radio-button-on" [ngStyle]="{ color: category?.color }" class="active me-3"></nb-icon>
        <div class="text-truncate" [class.text-hint]="!isActionable">{{ category?.name }}</div>
    </nb-list-item>`,
    imports: [NbListModule, NbIconModule, NgStyle],
})
export class CategoryListItemComponent {
    private dialogService = inject(NbDialogService);

    @Input({ required: true })
    public category: Category;

    @Input()
    public isActionable: boolean = true;

    @Output()
    public categoryChange: EventEmitter<Category> = new EventEmitter<Category>();

    public selectCategory(): void {
        if (!this.isActionable) {
            return;
        }

        this.dialogService
            .open(CategoriesDialogComponent, {
                context: {
                    selectedCategory: this.category,
                },
            })
            .onClose.subscribe((result: Category | null) => {
                if (result !== undefined) {
                    this.categoryChange.emit(result);
                }
            });
    }
}
