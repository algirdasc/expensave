import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { Category } from '../../../../api/objects/category';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryQueries } from '../../../../queries/category.queries';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

@Component({
    templateUrl: 'categories-dialog.component.html',
    styleUrl: 'categories-dialog.component.scss',
    imports: [NbSpinnerModule, CategoryListComponent, CategoryEditComponent],
})
export class CategoriesDialogComponent implements OnInit {
    public readonly dialogRef = inject<NbDialogRef<CategoriesDialogComponent>>(NbDialogRef);
    public isSelectable: boolean = true;
    public categories: Category[];
    public selectedCategory: Category;
    public editableCategory: Category;

    private readonly categoryQueries = inject(CategoryQueries);
    private readonly queryClient = inject(QueryClient);
    private isFetchingBusy = false;
    private readonly saveMutation = injectMutation(() => this.categoryQueries.save());

    public get isBusy(): boolean {
        return this.saveMutation.isPending() || this.isFetchingBusy;
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
        this.saveMutation.mutate(category, {
            onSuccess: () => {
                this.editableCategory = undefined;
                this.fetch();
            },
        });
    }

    public fetch(): void {
        let params = new HttpParams();
        if (!this.isSelectable) {
            params = params.append('userCategoriesOnly', 0);
        }

        this.isFetchingBusy = true;

        void this.queryClient
            .fetchQuery(this.categoryQueries.list(params))
            .then((categories: Category[]) => (this.categories = categories))
            .catch(() => undefined)
            .finally(() => (this.isFetchingBusy = false));
    }
}
