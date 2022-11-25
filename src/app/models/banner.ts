// Interfaces
export interface BannerInfo { // for MainBanner
    order: number;
    slideSpeed: number;
    image: any;
    previewImg: any;
    imageFile: any;
    link: string;
}

// Define to communicate with server
export type Category = 'main' | 'event' | 'genre';
export type SubCategory = 'event-main' | 'event-info' | 'event-free' // event
    | 'slide' | 'goods' | 'bottom-ads' | 'mypage'     // main
    | 'romance' | 'drama' | 'sports' | 'action' | 'etc'; // genre

export interface BannerItem {
    img_url: string;
    redirect_url: string;
    // slideSpeed: number;
}

export interface Banner {
    // id: string;
    count: string;
    list: BannerItem[];
}
