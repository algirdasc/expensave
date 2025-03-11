import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwipeEvent } from '../interfaces/swipe.interface';
import { createSwipeSubscription } from './swipe/swipe.core';

@Directive({
    selector: '[appSwipe]',
    standalone: false
})
export class SwipeDirective implements OnInit, OnDestroy {
    private swipeSubscription: Subscription | undefined;

    @Output()
    public swipeMove: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

    @Output()
    public swipeEnd: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

    public constructor(
        private elementRef: ElementRef,
        private zone: NgZone
    ) {}

    public ngOnInit(): void {
        this.zone.runOutsideAngular(() => {
            this.swipeSubscription = createSwipeSubscription({
                domElement: this.elementRef.nativeElement,
                onSwipeMove: (swipeMoveEvent: SwipeEvent) => this.swipeMove.emit(swipeMoveEvent),
                onSwipeEnd: (swipeEndEvent: SwipeEvent) => this.swipeEnd.emit(swipeEndEvent),
            });
        });
    }

    public ngOnDestroy(): void {
        this.swipeSubscription?.unsubscribe?.();
    }
}
