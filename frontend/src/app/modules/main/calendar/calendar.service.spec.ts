import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { provideTanStackQuery, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { Calendar } from '../../../api/objects/calendar';
import { Category, TYPE_BALANCE_UPDATE, TYPE_UNCATEGORIZED } from '../../../api/objects/category';
import { Expense } from '../../../api/objects/expense';
import { User } from '../../../api/objects/user';
import { CategoryQueries } from '../../../queries/category.queries';
import { UserQueries } from '../../../queries/user.queries';
import { ExpenseDialogComponent } from '../dialogs/expense-dialog/expense-dialog.component';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
    let dialogService: jasmine.SpyObj<NbDialogService>;
    let categoryQueries: jasmine.SpyObj<CategoryQueries>;
    let userQueries: jasmine.SpyObj<UserQueries>;
    let user: User;
    let service: CalendarService;

    beforeEach(() => {
        user = userWithId(1);
        const categories = [categoryWithType(TYPE_UNCATEGORIZED), categoryWithType(TYPE_BALANCE_UPDATE)];

        dialogService = jasmine.createSpyObj<NbDialogService>('NbDialogService', ['open']);
        categoryQueries = jasmine.createSpyObj<CategoryQueries>('CategoryQueries', ['system']);
        userQueries = jasmine.createSpyObj<UserQueries>('UserQueries', ['profile']);

        categoryQueries.system.and.returnValue(
            queryOptions({
                queryKey: ['category', 'system'],
                queryFn: (): Promise<Category[]> => Promise.resolve(categories),
                initialData: categories,
            })
        );
        userQueries.profile.and.returnValue(
            queryOptions({
                queryKey: ['user', 'profile'],
                queryFn: (): Promise<User> => Promise.resolve(userWithId(1)),
                initialData: user,
            })
        );

        TestBed.configureTestingModule({
            providers: [
                CalendarService,
                provideTanStackQuery(new QueryClient()),
                { provide: NbDialogService, useValue: dialogService },
                { provide: CategoryQueries, useValue: categoryQueries },
                { provide: UserQueries, useValue: userQueries },
            ],
        });

        service = TestBed.inject(CalendarService);
    });

    it('creates a confirmed uncategorized expense and opens the expense dialog', (): void => {
        const calendar = calendarWithId(3);
        const dialogResult = new Expense();
        dialogService.open.and.returnValue(dialogRefWithCloseResult(dialogResult));

        service.createExpense(calendar, new Date('2026-01-15T00:00:00'));

        expect(dialogService.open).toHaveBeenCalledOnceWith(
            ExpenseDialogComponent,
            jasmine.objectContaining({
                context: jasmine.objectContaining({
                    showBalanceTab: true,
                    showTransferTab: true,
                    deletable: false,
                }),
            })
        );

        const context = dialogService.open.calls.mostRecent().args[1].context as { expense: Expense };
        expect(context.expense.calendar.id).toBe(calendar.id);
        expect(context.expense.user.id).toBe(user.id);
        expect(context.expense.confirmed).toBeTrue();
        expect(context.expense.category.type).toBe(TYPE_UNCATEGORIZED);
        expect(context.expense.createdAt.getFullYear()).toBe(2026);
        expect(context.expense.createdAt.getMonth()).toBe(0);
        expect(context.expense.createdAt.getDate()).toBe(15);
        expect(dialogService.open).toHaveBeenCalled();
    });

    it('opens the edit dialog with a copy of the clicked expense payload', (): void => {
        const expense = expenseWithId(5, categoryWithType(TYPE_UNCATEGORIZED));
        dialogService.open.and.returnValue(dialogRefWithCloseResult(expense));

        service.editExpense(expense);

        expect(dialogService.open).toHaveBeenCalledOnceWith(
            ExpenseDialogComponent,
            jasmine.objectContaining({
                context: jasmine.objectContaining({
                    showBalanceTab: false,
                    showTransferTab: false,
                    deletable: true,
                }),
            })
        );
        const context = dialogService.open.calls.mostRecent().args[1].context as { expense: Expense };
        expect(context.expense).not.toBe(expense);
        expect(context.expense.id).toBe(expense.id);
        expect(context.expense.category.type).toBe(expense.category.type);
        expect(dialogService.open).toHaveBeenCalled();
    });

    it('shows the balance tab when editing a balance update expense', (): void => {
        const expense = expenseWithId(7, categoryWithType(TYPE_BALANCE_UPDATE));
        dialogService.open.and.returnValue(dialogRefWithCloseResult(undefined));

        service.editExpense(expense);

        expect(dialogService.open).toHaveBeenCalledOnceWith(
            ExpenseDialogComponent,
            jasmine.objectContaining({
                context: jasmine.objectContaining({
                    showBalanceTab: true,
                    showTransferTab: false,
                    deletable: true,
                }),
            })
        );
        const context = dialogService.open.calls.mostRecent().args[1].context as { expense: Expense };
        expect(context.expense).not.toBe(expense);
        expect(context.expense.id).toBe(expense.id);
        expect(context.expense.category.type).toBe(expense.category.type);
        expect(dialogService.open).toHaveBeenCalled();
    });
});

const calendarWithId = (id: number): Calendar => {
    const calendar = new Calendar();
    calendar.id = id;

    return calendar;
};

const categoryWithType = (type: string): Category => {
    const category = new Category();
    category.type = type;

    return category;
};

const dialogRefWithCloseResult = (result: Expense | undefined): ReturnType<NbDialogService['open']> =>
    ({ onClose: of(result) }) as ReturnType<NbDialogService['open']>;

const expenseWithId = (id: number, category: Category): Expense => {
    const expense = new Expense();
    expense.id = id;
    expense.category = category;

    return expense;
};

const userWithId = (id: number): User => {
    const user = new User();
    user.id = id;

    return user;
};
