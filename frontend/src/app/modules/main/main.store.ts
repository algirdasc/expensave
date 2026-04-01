import { Injectable, signal, WritableSignal } from '@angular/core';
import { Calendar } from '../../api/objects/calendar';
import { Category } from '../../api/objects/category';

@Injectable({ providedIn: 'root' })
export class MainStore {
    readonly selectedCalendar: WritableSignal<Calendar> = signal<Calendar>(null);
    readonly selectedMonth: WritableSignal<Date> = signal<Date>(new Date());
    readonly selectedPeriod: WritableSignal<{ from: Date; to: Date }> = signal<{ from: Date; to: Date }>({
        from: null,
        to: null,
    });
    readonly systemCategories: WritableSignal<Category[]> = signal<Category[]>([]);
    readonly isMobile: WritableSignal<boolean> = signal<boolean>(false);

    getSystemCategory(type: string): Category {
        return this.systemCategories().filter((category: Category) => category.type === type)[0];
    }
}
