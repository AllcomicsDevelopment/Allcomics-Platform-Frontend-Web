import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private readonly eventSubject: any;
    constructor() {
        this.eventSubject = {};
    }

    public on(event: string) {
        if (!this.eventSubject[event]) {
            this.eventSubject[event] = new Subject();
        }
        return this.eventSubject[event].asObservable();
    }

    public emit(event: string, params: any) {
        if (!this.eventSubject[event]) {
            this.eventSubject[event] = new Subject();
        }
        return this.eventSubject[event].next(params);
    }
}
