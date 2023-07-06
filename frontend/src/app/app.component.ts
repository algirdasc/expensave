import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<nb-layout><nb-layout-column class="p-0"><router-outlet></router-outlet></nb-layout-column></nb-layout>`
})
export class AppComponent {

}
