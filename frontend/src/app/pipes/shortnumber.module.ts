import {NgModule} from '@angular/core';
import {ShortNumberPipe} from './shortnumber.pipe';

@NgModule({
    declarations: [ ShortNumberPipe ],
    exports: [ ShortNumberPipe ]
})
export class ShortNumberModule { }
