export class Inqueries {
    id: string = null;
    type?: string = null;
    title: string = null;
    content: string = null;

    constructor(data?: any) {
        if (data) {
            const self = this;
            for (const key of Object.keys(data)) {
                if (self.hasOwnProperty(key)) {
                    self[key] = data[key];
                }
            }
        }
    }
}
