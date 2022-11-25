import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';

import * as AWS from 'aws-sdk';

@Injectable()
export class AWSSNSService {

    constructor() {
    }

    public publishPayload(target: string, payload: any): Observable<any> {
        if (!target) {
            return throwError('no target!');
        }
        if (!payload) {
            return throwError('no payload!');
        }

        const params = {
            TopicArn: target,
            Subject: 'error',
            Message: JSON.stringify({
                default: payload && typeof payload === 'object' ? JSON.stringify(payload) : payload,
            }),
            MessageStructure: 'json',
        };

        const publishSNS$ = from(new AWS.SNS().publish(params).promise()); // as observable
        return publishSNS$;
    }
}

