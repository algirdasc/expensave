import { TestBed } from '@angular/core/testing';
import { NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { Category } from '../../../../../../api/objects/category';
import { CategoryListItemComponent } from './category-list-item.component';

describe('CategoryListItemComponent', () => {
    let component: CategoryListItemComponent;
    let dialogService: jasmine.SpyObj<NbDialogService>;
    let closeSubject: Subject<Category | undefined>;

    beforeEach(() => {
        closeSubject = new Subject<Category | undefined>();
        dialogService = jasmine.createSpyObj<NbDialogService>('NbDialogService', ['open']);
        dialogService.open.and.returnValue({ onClose: closeSubject } as unknown as ReturnType<NbDialogService['open']>);

        TestBed.configureTestingModule({
            providers: [{ provide: NbDialogService, useValue: dialogService }],
        });

        component = TestBed.runInInjectionContext(() => new CategoryListItemComponent());
        component.category = categoryWithId(1, 'Food');
    });

    it('does not open category dialog when field is not actionable', () => {
        component.isActionable = false;

        component.selectCategory();

        expect(dialogService.open).not.toHaveBeenCalled();
    });

    it('emits selected category when dialog closes with a category', () => {
        const selectedCategory = categoryWithId(2, 'Transport');
        const emitted: Category[] = [];
        component.categoryChange.subscribe((category: Category) => emitted.push(category));

        component.selectCategory();
        closeSubject.next(selectedCategory);

        expect(dialogService.open).toHaveBeenCalled();
        expect(emitted).toEqual([selectedCategory]);
    });

    it('does not emit category when dialog closes without selection', () => {
        const emitted: Category[] = [];
        component.categoryChange.subscribe((category: Category) => emitted.push(category));

        component.selectCategory();
        closeSubject.next(undefined);

        expect(dialogService.open).toHaveBeenCalled();
        expect(emitted).toEqual([]);
    });
});

const categoryWithId = (id: number, name: string): Category => {
    const category = new Category();
    category.id = id;
    category.name = name;

    return category;
};
