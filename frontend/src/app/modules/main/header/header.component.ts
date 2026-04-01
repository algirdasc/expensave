import { Component } from '@angular/core';
import { HeaderCalendarInfoComponent } from './components/header-calendar-info.component';
import { HeaderDatePickerComponent } from './components/header-date-picker.component';
import { HeaderNavButtonsComponent } from './components/header-nav-buttons.component';
import { HeaderSidebarToggleComponent } from './components/header-sidebar-toggle.component';

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    selector: 'app-header',
    imports: [
        HeaderSidebarToggleComponent,
        HeaderCalendarInfoComponent,
        HeaderDatePickerComponent,
        HeaderNavButtonsComponent,
    ],
})
export class HeaderComponent {}
