import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { environment } from '../../../../../environments/environment';
import { APP_CONFIG } from '../../../../app.initializer';
import { NgOptimizedImage } from '@angular/common';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        NgOptimizedImage,
        NbAlertModule,
        FormsModule,
        NbInputModule,
        RouterLink,
        NbCheckboxModule,
        NbButtonModule,
        NbIconModule,
    ],
})
export class LoginComponent extends NbLoginComponent {
    protected readonly APP_CONFIG = APP_CONFIG;
    protected readonly environment = environment;
}
