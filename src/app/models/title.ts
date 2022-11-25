export interface Title {
    id?: string;
    image?: string;
    episodeCount?: number;
    validEpisodeCount: number;
    thumbnail?: {
        sq: string;
        vs: string;
        hs: string;
        hl: string;
    };
    description?: string;
    genre?: string[];
    name?: string;
    day?: string;
    age?: number;
    updateDate?: Date;  // timestamp
    postDay?: number;
    stars?: string;
    language?: string;
    purchasedType?: string;
    contentType?: any;
}
