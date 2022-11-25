export class Comic {
    id: string = null;
    type: string = null;
    title: string = null;
    src: string = null;
    alt: string = null;
    link: string = null;
    episode: number = null;
    age: number = null;
    genre: any = null;
    trend?: any = null;

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
