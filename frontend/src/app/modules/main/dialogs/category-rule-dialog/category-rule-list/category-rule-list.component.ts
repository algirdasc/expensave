import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slideAnimation } from '../../../../../animations/slide.animation';
import { CategoryRule } from '../../../../../api/objects/category-rule';

@Component({
    templateUrl: 'category-rule-list.component.html',
    styleUrl: 'category-rule-list.component.scss',
    selector: 'app-category-rule-list',
    animations: slideAnimation,
})
export class CategoryRuleListComponent {
    @Input({ required: true })
    protected categoryRules: CategoryRule[];

    @Output()
    protected categoryRuleSelect: EventEmitter<CategoryRule> = new EventEmitter<CategoryRule>();

    public editCategoryRule(categoryRule: CategoryRule): void {
        this.categoryRuleSelect.emit(categoryRule);
    }

    public createCategoryRule(): void {
        this.categoryRuleSelect.emit(new CategoryRule());
    }
}
