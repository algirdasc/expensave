import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slideAnimation } from '../../../../../animations/slide.animation';
import { Category } from '../../../../../api/objects/category';
import { UNCATEGORIZED_COLOR } from '../../../../../util/color.util';

@Component({
    templateUrl: 'category-list.component.html',
    styleUrls: ['category-list.component.scss'],
    selector: 'app-category-list',
    animations: slideAnimation,
})
export class CategoryListComponent {
    @Input() public categories: Category[];
    @Input() public selectedCategory: Category;
    @Output() public categoryClick: EventEmitter<Category> = new EventEmitter<Category>();
    @Output() public newCategoryClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected readonly UNCATEGORIZED_COLOR: string = UNCATEGORIZED_COLOR;

    public isActive(category: Category): boolean {
        return category.id === this.selectedCategory?.id;
    }
}
