import { animate, style, transition, trigger } from '@angular/animations';

export const slideAnimation = [
    trigger('slideAnimation', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('100ms', style({ opacity: 1 })),
            // animate('200ms', style({ height: '*' })),
        ]),
        transition(':leave', [
            style({ opacity: 1, height: '*' }),
            animate('100ms', style({ opacity: 0 })),
            animate('200ms', style({ height: '0' })),
        ]),
    ]),
];
