import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';
import { MainService } from './main.service';

describe('MainService', () => {
    let service: MainService;
    let title: jasmine.SpyObj<Title>;

    beforeEach(() => {
        title = jasmine.createSpyObj<Title>('Title', ['setTitle']);

        TestBed.configureTestingModule({
            providers: [MainService, { provide: Title, useValue: title }],
        });

        service = TestBed.inject(MainService);
    });

    it('updates the page title when the active calendar changes', (): void => {
        service.calendar = calendarWithId(1, 'Household');

        expect(title.setTitle).toHaveBeenCalledOnceWith('Expensave - Household');
    });

    it('stores visible date as reactive main UI state', (): void => {
        const visibleDate = new Date('2026-01-10T00:00:00');

        service.visibleDate = visibleDate;

        expect(service.visibleDate).toBe(visibleDate);
    });

    it('finds system categories by type', (): void => {
        const category = categoryWithType('uncategorized');
        service.systemCategories = [categoryWithType('balance_update'), category];

        expect(service.getSystemCategory('uncategorized')).toBe(category);
    });
});

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
