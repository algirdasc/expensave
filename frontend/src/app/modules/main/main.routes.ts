import {Routes} from '@angular/router';
import {UserResolver} from '../../resolvers/user.resolver';
import {MainComponent} from './main.component';

export const mainRoutes: Routes = [
    {
        path: '',
        component: MainComponent,
        resolve: {
            user: UserResolver
        },
    }
];