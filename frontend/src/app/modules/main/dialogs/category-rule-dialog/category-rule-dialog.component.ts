import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CategoryRuleApiService } from '../../../../api/category-rule.api.service';
import { CategoryApiService } from '../../../../api/category.api.service';
import { Category } from '../../../../api/objects/category';
import { CategoryRule } from '../../../../api/objects/category-rule';

export const DIALOG_ACTION_CLOSE = 'close';

@Component({
    templateUrl: 'category-rule-dialog.component.html',
    styleUrl: 'category-rule-dialog.component.scss',
})
export class CategoryRuleDialogComponent implements OnInit {
    protected categories: Category[];
    protected categoryRules: CategoryRule[] = [];
    protected selectedCategoryRule: CategoryRule;
    protected isBusy: boolean = false;

    public constructor(
        protected dialogRef: NbDialogRef<CategoryRuleDialogComponent>,
        private categoryRuleApiService: CategoryRuleApiService,
        private categoryApiService: CategoryApiService
    ) {
        this.categoryRuleApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public ngOnInit(): void {
        this.fetch();
    }

    public selectCategoryRule(categoryRule: CategoryRule): void {
        if (this.categories === undefined) {
            this.categoryApiService.list().subscribe((categories: Category[]) => {
                this.categories = categories;
                this.selectedCategoryRule = categoryRule;
            });
        } else {
            this.selectedCategoryRule = categoryRule;
        }
    }

    public saveSelectedCategoryRule(): void {
        this.categoryRuleApiService.save(this.selectedCategoryRule).subscribe(() => {
            this.selectedCategoryRule = undefined;
            this.fetch();
        });
    }

    public deleteSelectedCategoryRule(): void {
        if (!this.selectedCategoryRule?.id) {
            return;
        }

        this.categoryRuleApiService.delete(this.selectedCategoryRule.id).subscribe(() => {
            this.selectedCategoryRule = undefined;
            this.fetch();
        });
    }

    public fetch(): void {
        this.categoryRuleApiService.list().subscribe((response: CategoryRule[]) => (this.categoryRules = response));
    }

    protected readonly DIALOG_ACTION_CLOSE = DIALOG_ACTION_CLOSE;
}
