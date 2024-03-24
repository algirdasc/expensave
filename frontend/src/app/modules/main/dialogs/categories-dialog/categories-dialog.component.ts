import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {CategoryApiService} from '../../../../api/category.api.service';
import {Category} from '../../../../api/entities/category.entity';

@Component({
    templateUrl: 'categories-dialog.component.html',
    styleUrls: ['categories-dialog.component.scss'],
})
export class CategoriesDialogComponent implements OnInit {
    public isBusy: boolean = true;
    public isSelectable: boolean = true;
    public showEmptyCategory: boolean = false;
    public categories: Category[];
    public selectedCategory: Category;
    public editableCategory: Category;

    constructor(
      public readonly dialogRef: NbDialogRef<CategoriesDialogComponent>,
      private readonly categoryApiService: CategoryApiService
    ) {
        this.categoryApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
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
        this.categoryApiService
            .save(category)
            .subscribe(() => {
                this.editableCategory = undefined;
                this.fetch();
            })
        ;
    }

    public fetch(): void {
        this.categoryApiService
            .list()
            .subscribe((categories: Category[]) => this.categories = categories)
        ;
    }
}
