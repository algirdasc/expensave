import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { Category } from '../../../../api/objects/category';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryQueries } from '../../../../queries/category.queries';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';

@Component({
    templateUrl: 'categories-dialog.component.html',
    imports: [NbSpinnerModule, CategoryListComponent, CategoryEditComponent],
})
export class CategoriesDialogComponent implements OnInit {
    public readonly dialogRef = inject<NbDialogRef<CategoriesDialogComponent>>(NbDialogRef);
    public isSelectable: boolean = true;
    public selectedCategory: Category;
    public editableCategory: Category;

    private readonly categoryQueries = inject(CategoryQueries);
    private readonly categoryListParams = signal<HttpParams>(new HttpParams());
    private readonly categoryListQueryEnabled = signal<boolean>(false);
    private readonly categoryListQuery = injectQuery(() => ({
        ...this.categoryQueries.list(this.categoryListParams()),
        enabled: this.categoryListQueryEnabled(),
    }));
    private readonly saveMutation = injectMutation(() => this.categoryQueries.save());

    public get isBusy(): boolean {
        return this.saveMutation.isPending() || this.categoryListQuery.isFetching();
    }

    public get categories(): Category[] {
        return this.categoryListQuery.data() ?? [];
    }

    public ngOnInit(): void {
        this.categoryListParams.set(this.getCategoryListParams());
        this.categoryListQueryEnabled.set(true);
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
        this.saveMutation.mutate(category, {
            onSuccess: () => (this.editableCategory = undefined),
        });
    }

    private getCategoryListParams(): HttpParams {
        let params = new HttpParams();
        if (!this.isSelectable) {
            params = params.append('userCategoriesOnly', 0);
        }

        return params;
    }
}
