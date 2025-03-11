import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { environment } from '../../../../../environments/environment';
import { APP_CONFIG } from '../../../../app.initializer';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: false
})
export class LoginComponent extends NbLoginComponent {
    protected readonly APP_CONFIG = APP_CONFIG;
    protected readonly environment = environment;
}
