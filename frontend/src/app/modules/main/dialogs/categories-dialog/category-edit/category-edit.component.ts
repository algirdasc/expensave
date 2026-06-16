import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogService,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbTooltipModule,
} from '@nebular/theme';
import { Category } from '../../../../../api/objects/category';
import { CategoryQueries } from '../../../../../queries/category.queries';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { injectMutation } from '@tanstack/angular-query-experimental';

@Component({
    templateUrl: 'category-edit.component.html',
    styleUrls: ['category-edit.component.scss'],
    selector: 'app-category-edit',
    imports: [
        FormsModule,
        NbCardModule,
        NbButtonModule,
        NbIconModule,
        NbFormFieldModule,
        NbInputModule,
        NbTooltipModule,
    ],
})
export class CategoryEditComponent {
    @Input()
    public saveButtonEnabled: boolean = true;

    @Input()
    public category: Category;

    @Output()
    public readonly save: EventEmitter<Category> = new EventEmitter<Category>();

    @Output()
    public readonly back: EventEmitter<boolean> = new EventEmitter<boolean>();

    public usedColors: Record<string, boolean> = {};
    public colors: string[] = [
        '#f3d04f',
        '#f9c463',
        '#f39c12',
        '#dd8a06',
        '#d35400',
        '#b24902',
        '#a63414',
        '#700b1e',
        '#c3193a',
        '#da4040',
        '#f46262',
        '#f288b1',
        '#d34d81',
        '#bd66a8',
        '#a33d8a',
        '#7359b6',
        '#5e4a92',
        '#3960d1',
        '#6687e7',
        '#0070b1',
        '#169dd5',
        '#52bce8',
        '#56cdd0',
        '#009ea2',
        '#2dd4bf',
        '#10b981',
        '#15803d',
        '#297541',
        '#84cc16',
        '#65a30d',
        '#6b8e23',
        '#7f8f67',
        '#c0b028',
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

    private readonly dialogService = inject(NbDialogService);
    private readonly categoryQueries = inject(CategoryQueries);
    private _categories: Category[];
    private readonly deleteMutation = injectMutation(() => this.categoryQueries.delete());

    @Input()
    public get categories(): Category[] {
        return this._categories;
    }

    public set categories(value: Category[]) {
        this._categories = value ?? [];
        this.usedColors = {};

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
                    this.deleteMutation.mutate(this.category, {
                        onSuccess: () => this.back.emit(true),
                    });
                }
            });
    }
}
