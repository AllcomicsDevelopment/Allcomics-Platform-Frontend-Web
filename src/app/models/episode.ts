import { CutModel } from '@app/models/cut';

export type EpisodeStatus = '' | 'new' | 'open-booked' | 'pending' | 'open' | 'close-booked' | 'closed';

export interface PayEpisode {
    type: 'rent' | 'buy';
    tdn: number;
    name: string;
}

export interface Episode {
    id?: string;
    titleID?: string;
    no?: number;
    thumbnail?: string;
    titleId?: string;
    name?: string;
    status?: string;
    price?: {
        currency?: string;
        rent?: any;
        buy?: any;
    };
    validFrom?: Date;
    validUntil?: Date;
    isNew?: boolean;
    isFree?: boolean;
    isViewed?: boolean;
    isPurchased: boolean;
    expiredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    displayPrice?: {
        currency?: string;
        rent?: any;
        buy?: any;
    };
}

export interface EpisodeDetail {
    titleID?: string;
    createdAt?: Date;
    deletedAt?: Date;
    purchasedAt?: Date;
    expiredAt?: any;
    cuts?: any[];
    free?: any;
    id?: string;
    isFree?: boolean;
    isNew?: boolean;
    isPurchased?: boolean;
    isValid?: boolean;
    isViewed?: boolean;
    name?: string;
    no?: number;
    price?: {
        currency?: string;
        rent?: any;
        buy?: any;
    };
    status?: string;
    thumbnail?: string;
    title?: string;
    titleId?: string;
    updatedAt?: Date;
    validFrom?: Date;
    validUntil?: Date;
    prevId?: string;
    nextId?: string;
    displayPrice?: {
        currency?: string;
        rent?: any;
        buy?: any;
    };
}
