import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CategoryApiService } from '../../../../../api/category.api.service';
import { Category } from '../../../../../api/objects/category';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
    templateUrl: 'category-edit.component.html',
    styleUrls: ['category-edit.component.scss'],
    selector: 'app-category-edit',
})
export class CategoryEditComponent {
    @Input()
    public saveButtonEnabled: boolean = true;

    @Input()
    public category: Category;

    @Output()
    public save: EventEmitter<Category> = new EventEmitter<Category>();

    @Output()
    public back: EventEmitter<boolean> = new EventEmitter<boolean>();

    public usedColors: object = {};
    public isBusy: boolean = false;
    public colors: string[] = [
        '#f3d04f',
        '#f9c463',
        '#f39c12',
        '#dd8a06',
        '#d35400',
        '#b24902',
        '#a63414',
        '#f46262',
        '#da4040',
        '#c3193a',
        '#700b1e',
        '#f288b1',
        '#d34d81',
        '#bd66a8',
        '#a33d8a',
        '#7359b6',
        '#5e4a92',
        '#6687e7',
        '#3960d1',
        '#52bce8',
        '#169dd5',
        '#0070b1',
        '#56cdd0',
        '#009ea2',
        '#57dabb',
        '#19bc96',
        '#329d69',
        '#297541',
        '#27ae60',
        '#5bc953',
        '#a8c85b',
        '#adb749',
        '#9ca66e',
        '#9b882b',
        '#745015',
        '#905d65',
        '#b19993',
        '#a8c0a8',
        '#668686',
        '#b0b6ba',
        '#616d75',
        '#394852',
    ];

    private _categories: Category[];

    public constructor(
        private dialogService: NbDialogService,
        private categoryApiService: CategoryApiService
    ) {}

    @Input()
    public get categories(): Category[] {
        return this._categories;
    }

    public set categories(value: Category[]) {
        this._categories = value;
        for (const category of this._categories) {
            this.usedColors[category.color] = true;
        }
    }

    public deleteCategory(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: 'Are you sure you want delete this category?',
                },
            })
            .onClose.subscribe((result?: boolean) => {
                if (result) {
                    this.categoryApiService.delete(this.category.id).subscribe(() => this.back.emit(true));
                }
            });
    }
}
