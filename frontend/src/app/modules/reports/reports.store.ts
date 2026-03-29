import { Injectable, signal, WritableSignal } from '@angular/core';
import { Calendar } from '../../api/objects/calendar';

@Injectable({ providedIn: 'root' })
export class ReportsStore {
    readonly calendars: WritableSignal<Calendar[]> = signal<Calendar[]>([]);
}
