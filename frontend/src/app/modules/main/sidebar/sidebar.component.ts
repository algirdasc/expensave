import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { ActionsComponent } from './actions/actions.component';

@Component({
    templateUrl: 'sidebar.component.html',
    selector: 'app-sidebar',
    imports: [ProfileComponent, CalendarListComponent, ActionsComponent],
})
export class SidebarComponent {}
