import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slideAnimation } from '../../../../../animations/slide.animation';
import { Category } from '../../../../../api/objects/category';
import { UNCATEGORIZED_COLOR } from '../../../../../util/color.util';
import { NbButtonModule, NbCardModule, NbIconModule, NbListModule, NbTooltipModule } from '@nebular/theme';

@Component({
    templateUrl: 'category-list.component.html',
    styleUrls: ['category-list.component.scss'],
    selector: 'app-category-list',
    animations: slideAnimation,
    imports: [NbCardModule, NbButtonModule, NbIconModule, NbListModule, NbTooltipModule],
})
export class CategoryListComponent {
    @Input() public categories: Category[];
    @Output() public readonly categoryClick: EventEmitter<Category> = new EventEmitter<Category>();
    @Output() public readonly newCategoryClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public readonly back: EventEmitter<boolean> = new EventEmitter<boolean>();
    public selectedCategoryId: number | null = null;

    protected readonly UNCATEGORIZED_COLOR: string = UNCATEGORIZED_COLOR;

    @Input() public set selectedCategory(value: Category) {
        this.selectedCategoryId = value?.id ?? null;
    }
}
