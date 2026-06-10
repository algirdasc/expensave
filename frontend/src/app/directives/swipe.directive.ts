import { Directive, ElementRef, EventEmitter, inject, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwipeEvent } from '../interfaces/swipe.interface';
import { createSwipeSubscription } from './swipe/swipe.core';

@Directive({ selector: '[appSwipe]', standalone: true })
export class SwipeDirective implements OnInit, OnDestroy {
    @Output()
    public readonly swipeMove: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

    @Output()
    public readonly swipeEnd: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();

    private elementRef = inject(ElementRef);
    private zone = inject(NgZone);
    private swipeSubscription: Subscription | undefined;

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
