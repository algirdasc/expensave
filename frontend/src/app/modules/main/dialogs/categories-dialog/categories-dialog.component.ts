import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { CategoryApiService } from '../../../../api/category.api.service';
import { Category } from '../../../../api/objects/category';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';

@Component({
    templateUrl: 'categories-dialog.component.html',
    styleUrl: 'categories-dialog.component.scss',
    imports: [NbSpinnerModule, CategoryListComponent, CategoryEditComponent],
})
export class CategoriesDialogComponent implements OnInit {
    public readonly dialogRef = inject<NbDialogRef<CategoriesDialogComponent>>(NbDialogRef);
    private readonly categoryApiService = inject(CategoryApiService);

    public isBusy: boolean = true;
    public isSelectable: boolean = true;
    public categories: Category[];
    public selectedCategory: Category;
    public editableCategory: Category;

    public constructor() {
        this.categoryApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public ngOnInit(): void {
        this.fetch();
    }

    public categoryClick(category: Category): void {
        if (!this.isSelectable) {
            this.editCategory(category);
        } else {
            this.dialogRef.close(category);
        }
    }

    public editCategory(category?: Category): void {
        this.editableCategory = category ?? new Category();
    }

    public saveCategory(category: Category): void {
        this.categoryApiService.save(category).subscribe(() => {
            this.editableCategory = undefined;
            this.fetch();
        });
    }

    public fetch(): void {
        let params = new HttpParams();
        if (!this.isSelectable) {
            params = params.append('userCategoriesOnly', 0);
        }

        this.categoryApiService.list(params).subscribe((categories: Category[]) => (this.categories = categories));
    }
}
