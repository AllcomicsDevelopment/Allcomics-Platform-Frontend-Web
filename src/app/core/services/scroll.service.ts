import { Observable, Subject, interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, pairwise, filter, throttle, throttleTime, share } from 'rxjs/operators';

export interface Position {
    scrollHeight: number;
    scrollTop: number;
    offsetHeight: number;
}

export enum Direction {
    Up = 'Up',
    Down = 'Down',
}

@Injectable()
export class ScrollService {

    private _scrollPercent = 75;
    private scrollSubject: Subject<any> = new Subject();

    constructor() {
        window.addEventListener('scroll', this.onScroll.bind(this), true);
    }

    private onScroll = event => this.scrollSubject.next(event.target);

    private isScrollExpectedPercent = (position: Position, percent: number) => {
        return (position.scrollTop + position.offsetHeight) / position.scrollHeight > percent / 100;
    }

    get scrollPercent(): number {
        return this._scrollPercent;
    }

    set scrollPercent(scrollPercent: number) {
        this._scrollPercent = scrollPercent;
    }

    get onScrollEvent$(): Observable<any> {
        return this.scrollSubject.asObservable();
    }

    get onScroll$(): Observable<Position> {
        return this.scrollSubject.asObservable().pipe(
            throttle(() => interval(20)),
            map(doc => {
                const { scrollHeight, scrollTop, offsetHeight } = doc;
                return { scrollHeight, scrollTop, offsetHeight };
            })
        );
    }

    get onScrolledDown$(): Observable<[Position, Position]> {
        return this.onScrollEvent$.pipe(
            throttle(() => interval(50)),
            map(doc => {
                const { scrollHeight, scrollTop, offsetHeight } = doc;
                return { scrollHeight, scrollTop, offsetHeight };
            }),
            pairwise(),
            filter(([prev, next]) => prev.scrollTop < next.scrollTop), // Direction Down
            filter(positions => this.isScrollExpectedPercent(positions[1], this._scrollPercent)),
            share(),
        );
    }

    get onScrollDown$(): Observable<Direction> {
        return this.onScrollEvent$.pipe(
            throttleTime(15),
            map((doc) => doc.scrollTop),
            pairwise(),
            map(([y1, y2]) => {
                return y1 < y2 ? Direction.Down : Direction.Up;
            }),
            share(),
            filter(direction => direction === Direction.Down),
        );
    }

    get onScrollUp$(): Observable<Direction> {
        return this.onScrollEvent$.pipe(
            throttleTime(15),
            map(() => window.pageYOffset),
            pairwise(),
            map(([y1, y2]) => {
                return y1 < y2 ? Direction.Down : Direction.Up;
            }),
            share(),
            filter(direction => direction === Direction.Up),
        );
    }
}
