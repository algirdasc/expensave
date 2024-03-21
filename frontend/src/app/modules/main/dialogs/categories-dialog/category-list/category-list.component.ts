import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from '../../../../../api/entities/category.entity';
import {UNCATEGORIZED_COLOR} from '../../../../../util/color.util';

@Component({
    templateUrl: 'category-list.component.html',
    styleUrls: ['category-list.component.scss'],
    selector: 'app-category-list',
})
export class CategoryListComponent {
    @Input() public categories: Category[];
    @Input() public selectedCategory: Category;
    @Input() public showEmptyCategory: boolean;
    @Output() public categoryClick: EventEmitter<Category> = new EventEmitter<Category>();
    @Output() public newCategoryClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected readonly UNCATEGORIZED_COLOR: string = UNCATEGORIZED_COLOR;

    public isActive(category: Category): boolean {
        return category.id === this.selectedCategory?.id;
    }
}
