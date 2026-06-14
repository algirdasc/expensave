import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NbDateService } from '@nebular/theme';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';
import { Expense } from '../../api/objects/expense';
import { ExpenseBalance } from '../../api/objects/expense-balance';
import { CalendarExpenseListResponse } from '../../api/response/calendar-expense-list.response';
import { CalendarQueries } from '../../queries/calendar.queries';
import { MainService } from './main.service';

describe('MainService', () => {
    let calendarQueries: jasmine.SpyObj<CalendarQueries>;
    let queryClient: jasmine.SpyObj<QueryClient>;
    let service: MainService;
    let title: jasmine.SpyObj<Title>;

    beforeEach(() => {
        calendarQueries = jasmine.createSpyObj<CalendarQueries>('CalendarQueries', ['expenseList']);
        queryClient = jasmine.createSpyObj<QueryClient>('QueryClient', ['fetchQuery']);
        title = jasmine.createSpyObj<Title>('Title', ['setTitle']);

        TestBed.configureTestingModule({
            providers: [
                MainService,
                { provide: CalendarQueries, useValue: calendarQueries },
                { provide: QueryClient, useValue: queryClient },
                { provide: Title, useValue: title },
                {
                    provide: NbDateService,
                    useValue: {
                        isSameMonthSafe: (dateA: Date, dateB: Date): boolean => dateA.getMonth() === dateB.getMonth(),
                        isSameYearSafe: (dateA: Date, dateB: Date): boolean =>
                            dateA.getFullYear() === dateB.getFullYear(),
                    },
                },
            ],
        });

        service = TestBed.inject(MainService);
    });

    it('updates the page title when the active calendar changes', (): void => {
        service.calendar = calendarWithId(1, 'Household');

        expect(title.setTitle).toHaveBeenCalledOnceWith('Expensave - Household');
    });

    it('does not fetch expenses until calendar and date range are available', (): void => {
        service.calendar = calendarWithId(1, 'Household');

        service.refreshCalendar();

        expect(queryClient.fetchQuery).not.toHaveBeenCalled();
    });

    it('fetches calendar expenses and applies response state', async (): Promise<void> => {
        const activeCalendar = calendarWithId(1, 'Household');
        const responseCalendar = calendarWithId(2, 'Updated');
        const queryOptions = { queryKey: ['calendar', 'expenses'] } as unknown as ReturnType<
            CalendarQueries['expenseList']
        >;
        const response = calendarExpenseListResponse(responseCalendar);

        service.calendar = activeCalendar;
        service.visibleDate = new Date('2026-01-10T00:00:00');
        service.calendarDateFrom = new Date('2026-01-01T00:00:00');
        service.calendarDateTo = new Date('2026-01-31T00:00:00');
        calendarQueries.expenseList.and.returnValue(queryOptions);
        queryClient.fetchQuery.and.resolveTo(response);

        service.refreshCalendar();
        await Promise.resolve();

        expect(calendarQueries.expenseList).toHaveBeenCalledOnceWith(
            activeCalendar.id,
            service.calendarDateFrom,
            service.calendarDateTo
        );
        expect(queryClient.fetchQuery).toHaveBeenCalledOnceWith(queryOptions);
        expect(service.calendar).toBe(responseCalendar);
        expect(service.expenses).toBe(response.expenses);
        expect(service.expenseBalances).toBe(response.expenseBalances);
        expect(service.visibleDateBalance).toBe(75);
        expect(title.setTitle).toHaveBeenCalledWith('Expensave - Updated');
    });

    it('finds system categories by type', (): void => {
        const category = categoryWithType('uncategorized');
        service.systemCategories = [categoryWithType('balance_update'), category];

        expect(service.getSystemCategory('uncategorized')).toBe(category);
    });
});

const calendarExpenseListResponse = (calendar: Calendar): CalendarExpenseListResponse => {
    const response = new CalendarExpenseListResponse();
    response.calendar = calendar;
    response.expenses = [new Expense()];
    response.expenseBalances = [
        expenseBalance(new Date('2026-01-01T00:00:00'), 50),
        expenseBalance(new Date('2026-01-20T00:00:00'), 25),
        expenseBalance(new Date('2026-02-01T00:00:00'), 100),
    ];

    return response;
};

const calendarWithId = (id: number, name: string): Calendar => {
    const calendar = new Calendar();
    calendar.id = id;
    calendar.name = name;

    return calendar;
};

const categoryWithType = (type: string): Category => {
    const category = new Category();
    category.type = type;

    return category;
};

const expenseBalance = (balanceAt: Date, change: number): ExpenseBalance => {
    const balance = new ExpenseBalance();
    balance.balanceAt = balanceAt;
    balance.change = change;

    return balance;
};
