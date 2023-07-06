import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from '../../../../../api/entities/category.entity';

@Component({
    templateUrl: 'category-list.component.html',
    styleUrls: ['category-list.component.scss'],
    selector: 'app-category-list'
})
export class CategoryListComponent {
    @Input() public categories: Category[];
    @Output() public categoryClick: EventEmitter<Category> = new EventEmitter<Category>();
}