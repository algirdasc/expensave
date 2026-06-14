import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { Calendar } from '../../../api/objects/calendar';
import { Category, TYPE_BALANCE_UPDATE, TYPE_UNCATEGORIZED } from '../../../api/objects/category';
import { Expense } from '../../../api/objects/expense';
import { User } from '../../../api/objects/user';
import { ExpenseQueries } from '../../../queries/expense.queries';
import { ExpenseDialogComponent } from '../dialogs/expense-dialog/expense-dialog.component';
import { MainService } from '../main.service';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
    let dialogService: jasmine.SpyObj<NbDialogService>;
    let expenseQueries: jasmine.SpyObj<ExpenseQueries>;
    let mainService: jasmine.SpyObj<MainService>;
    let queryClient: jasmine.SpyObj<QueryClient>;
    let service: CalendarService;

    beforeEach(() => {
        dialogService = jasmine.createSpyObj<NbDialogService>('NbDialogService', ['open']);
        expenseQueries = jasmine.createSpyObj<ExpenseQueries>('ExpenseQueries', ['get']);
        mainService = jasmine.createSpyObj<MainService>('MainService', ['getSystemCategory', 'refreshCalendar'], {
            user: userWithId(1),
        });
        queryClient = jasmine.createSpyObj<QueryClient>('QueryClient', ['fetchQuery']);

        mainService.getSystemCategory
            .withArgs(TYPE_UNCATEGORIZED)
            .and.returnValue(categoryWithType(TYPE_UNCATEGORIZED));
        mainService.getSystemCategory
            .withArgs(TYPE_BALANCE_UPDATE)
            .and.returnValue(categoryWithType(TYPE_BALANCE_UPDATE));

        TestBed.configureTestingModule({
            providers: [
                CalendarService,
                { provide: NbDialogService, useValue: dialogService },
                { provide: ExpenseQueries, useValue: expenseQueries },
                { provide: MainService, useValue: mainService },
                { provide: QueryClient, useValue: queryClient },
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
        expect(context.expense.user.id).toBe(mainService.user.id);
        expect(context.expense.confirmed).toBeTrue();
        expect(context.expense.category.type).toBe(TYPE_UNCATEGORIZED);
        expect(context.expense.createdAt.getFullYear()).toBe(2026);
        expect(context.expense.createdAt.getMonth()).toBe(0);
        expect(context.expense.createdAt.getDate()).toBe(15);
        expect(mainService.refreshCalendar).toHaveBeenCalledOnceWith();
    });

    it('fetches an existing expense before opening the edit dialog', async (): Promise<void> => {
        const requestedExpense = expenseWithId(5, categoryWithType(TYPE_UNCATEGORIZED));
        const fetchedExpense = expenseWithId(5, categoryWithType(TYPE_UNCATEGORIZED));
        const queryOptions = { queryKey: ['expense', 'detail', requestedExpense.id] } as unknown as ReturnType<
            ExpenseQueries['get']
        >;

        expenseQueries.get.and.returnValue(queryOptions);
        queryClient.fetchQuery.and.resolveTo(fetchedExpense);
        dialogService.open.and.returnValue(dialogRefWithCloseResult(fetchedExpense));

        service.editExpense(requestedExpense);
        await Promise.resolve();

        expect(expenseQueries.get).toHaveBeenCalledOnceWith(requestedExpense.id);
        expect(queryClient.fetchQuery).toHaveBeenCalledOnceWith(queryOptions);
        expect(dialogService.open).toHaveBeenCalledOnceWith(
            ExpenseDialogComponent,
            jasmine.objectContaining({
                context: jasmine.objectContaining({
                    expense: fetchedExpense,
                    showBalanceTab: false,
                    showTransferTab: false,
                    deletable: true,
                }),
            })
        );
        expect(mainService.refreshCalendar).toHaveBeenCalledOnceWith();
    });

    it('shows the balance tab when editing a balance update expense', async (): Promise<void> => {
        const expense = expenseWithId(7, categoryWithType(TYPE_BALANCE_UPDATE));
        const queryOptions = { queryKey: ['expense', 'detail', expense.id] } as unknown as ReturnType<
            ExpenseQueries['get']
        >;

        expenseQueries.get.and.returnValue(queryOptions);
        queryClient.fetchQuery.and.resolveTo(expense);
        dialogService.open.and.returnValue(dialogRefWithCloseResult(undefined));

        service.editExpense(expense);
        await Promise.resolve();

        expect(dialogService.open).toHaveBeenCalledOnceWith(
            ExpenseDialogComponent,
            jasmine.objectContaining({
                context: jasmine.objectContaining({
                    expense,
                    showBalanceTab: true,
                    showTransferTab: false,
                    deletable: true,
                }),
            })
        );
        expect(mainService.refreshCalendar).not.toHaveBeenCalled();
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
