import { inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Calendar } from '../../api/objects/calendar';

@Injectable({ providedIn: 'root' })
export class MainService {
    public isApplicationBusy: Subject<boolean> = new Subject<boolean>();

    private readonly title = inject(Title);
    private readonly activeCalendar = signal<Calendar>(null);
    private readonly activeVisibleDate = signal<Date>(new Date());

    public get calendar(): Calendar {
        return this.activeCalendar();
    }

    public get visibleDate(): Date {
        return this.activeVisibleDate();
    }

    public set calendar(calendar: Calendar) {
        this.activeCalendar.set(calendar);

        this.title.setTitle(`Expensave - ${calendar?.name ?? 'No calendar'}`);
    }

    public set visibleDate(visibleDate: Date) {
        this.activeVisibleDate.set(visibleDate);
    }
}

export const SIDEBAR_TAG = 'menu-sidebar';
