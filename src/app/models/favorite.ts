export interface Favorite {
    id?: string;
    description?: string;
    genres?: string[];
    image?: string;
    isCompleted?: boolean;
    isNew?: boolean;
    isRecommended?: boolean;
    name?: string;
    thumbnails?: {
        sq: string;
        vs: string;
        hs: string;
        hl: string;
    };
    thumbnail?: any;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    isFavorite?: boolean;
}
