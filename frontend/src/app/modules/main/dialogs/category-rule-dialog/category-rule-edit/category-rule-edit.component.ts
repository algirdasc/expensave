import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Category } from '../../../../../api/objects/category';
import { CategoryRule } from '../../../../../api/objects/category-rule';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
    templateUrl: 'category-rule-edit.component.html',
    styleUrl: 'category-rule-edit.component.scss',
    selector: 'app-category-rule-edit',
})
export class CategoryRuleEditComponent {
    @Input({ required: true })
    protected categoryRule: CategoryRule;

    @Input()
    protected categories: Category[] = [];

    @Output()
    protected categoryRuleSave: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    protected categoryRuleDelete: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    protected categoryRuleClose: EventEmitter<void> = new EventEmitter<void>();

    public constructor(private dialogService: NbDialogService) {}

    protected deleteCategoryRule(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: 'Are you sure you want delete this category rule?',
                },
            })
            .onClose.subscribe(result => {
                if (result) {
                    this.categoryRuleDelete.emit();
                }
            });
    }

    protected compareByCategoryId(v1: CategoryRule, v2: CategoryRule): boolean {
        return v1.id === v2.id;
    }
}
