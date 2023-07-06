import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from '../../../../../api/entities/category.entity';
import {CategoryApiService} from '../../../../../api/category.api.service';

@Component({
    templateUrl: 'category-edit.component.html',
    styleUrls: ['category-edit.component.scss'],
    selector: 'app-category-edit'
})
export class CategoryEditComponent {
    @Input() public category: Category;
    @Output() public save: EventEmitter<Category> = new EventEmitter<Category>();
    public usedColors: object = {};
    public isBusy: boolean = false;
    public colors: string[] = [
        '#f3d04f', '#f9c463', '#f39c12', '#dd8a06', '#d35400', '#b24902', '#a63414',
        '#f46262', '#da4040', '#c3193a', '#700b1e'
    ];
    private _categories: Category[];

    constructor(private readonly categoryApiService: CategoryApiService) {
        this.categoryApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    @Input()
    get categories(): Category[] {
        return this._categories;
    }

    set categories(value: Category[]) {
        this._categories = value;
        for (const category of this._categories) {
            this.usedColors[category.color] = true;
        }
    }

    public onSubmit(): void {
        this.categoryApiService
            .save(this.category)
            .subscribe((category: Category) => {
                this.category = category;
                this.save.emit(this.category);
            })
        ;
    }
}