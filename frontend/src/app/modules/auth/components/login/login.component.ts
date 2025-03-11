import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { environment } from '../../../../../environments/environment';
import { APP_CONFIG } from '../../../../app.initializer';
import { NgOptimizedImage, NgIf, NgFor } from '@angular/common';
import { NbAlertModule, NbInputModule, NbCheckboxModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        NgOptimizedImage,
        NgIf,
        NbAlertModule,
        NgFor,
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
