import {Component, OnInit} from '@angular/core';
import {CategoryApiService} from '../../../../api/category.api.service';
import {Category} from '../../../../api/entities/category.entity';

@Component({
    templateUrl: 'categories-dialog.component.html',
    styleUrls: ['categories-dialog.component.scss'],
})
export class CategoriesDialogComponent implements OnInit {
    public isBusy: boolean = false;
    public categories: Category[];
    public category: Category;

    constructor(private readonly categoryApiService: CategoryApiService) {
        this.categoryApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngOnInit(): void {
        this.fetch();
    }

    public editCategory(category?: Category): void {
        this.category = category ?? new Category();
    }

    public fetch(): void {
        this.categoryApiService
            .list()
            .subscribe((categories: Category[]) => this.categories = categories)
        ;
    }
}