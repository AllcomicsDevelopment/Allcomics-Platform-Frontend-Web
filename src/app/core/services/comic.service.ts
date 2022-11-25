import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

import { Title } from '@app/models/title';
import { Inqueries } from '@app/models/inqueries';
import { Episode, EpisodeDetail, PayEpisode } from '@app/models/episode';
import { Account } from '@app/models/account';
import { Message } from '@app/models/message';
import { Favorite } from '@app/models/favorite';

import { environment } from '@environments/environment';

import 'rxjs/add/observable/fromPromise';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import {Banner} from '@app/models/banner';

// 1 tdn => 0.87 dollar
// 1 tdn => 1000원
// 1 tdn => 19.27 // = 1dollar
const CURRENCY_RATIO = {
    KRW: 0.001, // 1 / 1000
    USD: 1.149425287356322, // 1 / 0.87
    MXN: 0.051894135962636 // 1 / 19.27
};

@Injectable({
    providedIn: 'root'
})

export class ComicService extends BaseService {

    /* ----- MAIN -----*/
    getWeeks(params): Observable<Title[]> {
        // params = Object.assign({ page: 0, count: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = `/client/webtoon/search`;
                return this.request1$('GET', environment.localUrl, path, { ...params });
            }),
            map(res => res['body'].data.data.list.map((comic: Title) => comic)),
        );
    }

    getRankings(params: { limit?: number, page?: number, sort?: string, order?: string  }): Observable<Title[]> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                // const path = isAuth ? `/public/webtoon-list/search` : `/public/webtoon-list/search`;
                // return this.request$('GET', environment.apiUrl, path, { ...params });
                const path = `/client/webtoon/search`;
                return this.request1$('GET', environment.localUrl, path, { ...params });
            }),
            map(res => res['body'].data.data.list.map((comic: Title) => comic)),
        );
    }

    getCompleted(params): Observable<Title[]> {
        const url = `/client/webtoon/today-free/search`;

        return this.request1$('POST', environment.localUrl, url, params).pipe(
            map(res => {
                return res['body'].data.list.map(webtoon => {
                    return {
                        id: webtoon['webtoon_id'],
                        thumbnail: webtoon['thumbnails'],
                        status: webtoon['status'],
                        name: webtoon['webtoon_name'],
                        language: webtoon['language']
                    };
                });
            })
        );
    }

    getPopular(params: { keyword?: string }): Observable<Title[]> {
        const url = `/client/webtoon/popular/search`;

        return this.request1$('POST', environment.localUrl, url, params).pipe(
            map(res => {
                return res['body'].data.list.map(webtoon => {
                    return {
                        id: webtoon['webtoon_id'],
                        thumbnail: webtoon['thumbnails'],
                        status: webtoon['status'],
                        name: webtoon['webtoon_name'],
                        language: webtoon['language']
                    };
                });
            })
        );
    }

    getRecentlyUpdated(params): Observable<Title[]> {

        params = {
            page: 0,
            limit: 1000,
            sort: 'updatedAt',
            order: 'desc',
            genres: ['all'],
            language: params['language'],
        };

        const url = `/client/webtoon/search`;

        const date = new Date().getTime();

        return this.request1$('POST', environment.localUrl, url, params).pipe(
            map(res => {
                return res['body'].data.data.list.filter(
                    webtoon => (date - webtoon['updatedAt'] * 1000) / (1000 * 60 * 60 * 24 * 7) < 3.0
                );
            })
        );
    }

    getRomance(params: { keyword?: string }): Observable<Title[]> {
        const url = `/client/webtoon/challenge/search`;

        return this.request1$('POST', environment.localUrl, url, params).pipe(
            map(res => {
                return res['body'].data.list.map(webtoon => {
                    return {
                        id: webtoon['webtoon_id'],
                        thumbnail: webtoon['thumbnails'],
                        status: webtoon['status'],
                        name: webtoon['webtoon_name'],
                        language: webtoon['language']
                    };
                });
            })
        );
    }

    // getMillion(params: { keyword?: string }): Observable<Title[]> {
    //     return this.isAuthenticated$().pipe(
    //         switchMap(isAuth => {
    //             // const path = isAuth ? `/public/webtoon-list/search` : `/public/webtoon-list/search`;
    //             // return this.request$('GET', environment.apiUrl, path, { ...params });
    //             const path = `/client/webtoon/search`;
    //             return this.request1$('GET', environment.localUrl, path, { ...params });
    //         }),
    //         // map(res => res.list.map((comic: Title) => comic)),
    //         map(res => res['body'].data.data.list.map((comic: Title) => comic)),
    //     );
    // }

    getBoysLove(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                // const path = isAuth ? `/showcases/boys-love` : `/public/showcases/boys-love`;
                // return this.request$('GET', environment.apiUrl, path, { ...params });
                const path = `/client/webtoon/search`;
                return this.request1$('GET', environment.localUrl, path, { ...params });
            }),
            // map(res => res.list.map((comic: Title) => comic)),
            map(res => res['body'].data.data.list.map((comic: Title) => comic)),
        );
    }

    /* ----- MAIN -----*/

    /* ----- MAIN Novel start -----*/
    getGenreNovels(params: { genre: string, page?: number, count?: number }): Observable<any> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                // const path = isAuth ? `/public/novel-lists` : `/public/novel-lists`;
                // return this.request$('GET', environment.apiUrl, path, { ...params });
                const path = `/client/webnovel/search`;
                return this.request1$('GET', environment.localUrl, path, { ...params });
            }),
        );
    }

    getNWeeks(params: { genre: string, page?: number, count?: number }): Observable<any> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                // const path = isAuth ? `/public/novel-lists` : `/public/novel-lists`;
                // return this.request$('GET', environment.apiUrl, path, { ...params });
                const path = `/client/webnovel/search`;
                return this.request1$('GET', environment.localUrl, path, { ...params });
            }),
        );
    }


    getNovelRankings(params): Observable<any> {

        const param = {
            page: 0,
            limit: 5,
            sort: 'total_views',
            order: 'desc'
        };

        const path = `/client/webnovel/search`;
        return this.request1$('POST', environment.localUrl, path, { ...param }).pipe(
            map(res => {
                return res['body'].data.data.list;
            })
        );
    }

    getNovelCompleted(params: { keyword?: string }): Observable<Title[]> {
        const url = `/client/novel/today-free/search`;

        return this.request1$('POST', environment.localUrl, url, params).pipe(
            map(res => {
                return res['body'].data.list.map(novel => {
                    return {
                        id: novel['novel_id'],
                        thumbnail: novel['thumbnails'],
                        status: novel['status'],
                        name: novel['novel_name'],
                        language: novel['language']
                    };
                });
            })
        );
    }

    getNovelPopular(params: { keyword?: string }): Observable<Title[]> {

        params['page'] = 1;

        const url = `/client/novel/popular/search`;

        return this.request1$('POST', environment.localUrl, url, params).pipe(
            map(res => {
                return res['body'].data.list.map(novel => {
                    return {
                        id: novel['novel_id'],
                        thumbnail: novel['thumbnails'],
                        status: novel['status'],
                        name: novel['novel_name'],
                        language: novel['language']
                    };
                });
            })
        );
    }

    getNovelMillion(params: { keyword?: string }): Observable<Title[]> {

        params['page'] = 1;

        const url = `/client/novel/challenge/search`;

        return this.request1$('POST', environment.localUrl, url, params).pipe(
            map(res => {
                return res['body'].data.list.map(novel => {
                    return {
                        id: novel['novel_id'],
                        thumbnail: novel['thumbnails'],
                        status: novel['status'],
                        name: novel['novel_name'],
                        language: novel['language']
                    };
                });
            })
        );
    }

    getNovelRecent(params: { keyword?: string }): Observable<Title[]> {
        const param = {
            page: 0,
            limit: 1000,
            sort: 'updatedAt',
            order: 'desc',
            genres: ['all'],
            language: params['language'],
        };

        const url = `/client/webnovel/search`;

        const date = new Date().getTime();

        return this.request1$('POST', environment.localUrl, url, param).pipe(
            map(res => {
                return res['body'].data.data.list.filter(
                    novel => (date - novel['updatedAt'] * 1000) / (1000 * 60 * 60 * 24 * 7) < 3.0
                );
            })
        );
    }
    /* ----- MAIN Novel end -----*/


    // list & page
    getPurchased$(params: { page?: number, limit?: number }): Observable<any> {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const param = {
                    page: params['page'],
                    // page: 0,
                    count: params['limit'],
                    UserID: profile['body'].data.data.user_id,
                    sort: 'desc',
                    ContentType: 0,
                    PurchaseType: 0,
                };
                return this.request1$('POST', environment.localUrl, '/client/buy/all-search', param);
            })
        ).pipe(
            map(res => {
                return {
                    page: params['page'],
                    list: res['body'].data.data.data.map(webtoon => {
                        return {
                            // PurchaseType, ContentType
                            id: webtoon['ID'],
                            thumbnail: webtoon['thumbnail_image'],
                            name: webtoon['Name'],
                            validEpisodeCount: parseInt(webtoon['EpisodeID'].split('_')[1].slice(1), 10),
                            purchasedType: webtoon['PurchaseType'] === 0 ? 'buy' : 'rent',
                            contentType: webtoon['ContentType'] === 0 ? 'webtoon' : 'novel',
                            purchasedAt: webtoon['CreatedAt'],
                        };
                    })
                };
            }),
            catchError(() => {
                return of({
                    page: params['page'],
                    list: []
                });
            }),
        );
    }

    getFavoriteList$(params: { page?: number, limit?: number }): Observable<any> {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const param = {
                    page: params['page'],
                    count: params['limit'],
                    UserID: profile['body'].data.data.user_id,
                    sort: 'UpdatedAt',
                    ContentType: 0,
                    PurchaseType: 0,
                };
                return this.request1$('POST', environment.localUrl, '/client/webtoon/recommended/search', param);
            })
        ).pipe(
            map(res => {
                return {
                    page: params['page'],
                    list: res['body'].data.data.lists
                        .filter(webtoon => webtoon['IsValid'] == 1)
                        .map(webtoon => {
                        return {
                            id: webtoon['WebtoonID'],
                            thumbnail: webtoon['Webtoon']['thumbnail_image'],
                            name: webtoon['Webtoon']['webtoon_name'],
                        };
                    })
                };
            })
        );
    }

    getRecentlyViewed$(params: { page?: number, limit?: number }): Observable<any> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/titles/0/viewed`, params);
    }

    getRecentlyViewed(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/recently-viewed`, params).pipe(
            map(res => res.list.map((comic: Title) => comic)),
        );
    }
    /* ----- MY LIB -----*/

    /* ----- MY PAGE -----*/
    getAccount(): Observable<Account> {
        return this.request$('GET', environment.apiUrl, `/account/0`).pipe(
            map((res) => new Account(res)),
        );
    }

    setAccount(body: Account): Observable<any> {
        return this.request$('POST', environment.apiUrl, '/account/0', {}, body).pipe(
            map((res) => new Account(res)),
        );
    }

    deleteAccountByReason(params: { reason: string }): Observable<any> {
        return this.request$('DELETE', environment.apiUrl, `/account/0`, params);
    }
    /* ----- MY PAGE -----*/

    /* ----- CUSTOMER SUPPORT -----*/
    getInqueries(params: { page?: number, limit?: number }): Observable<Inqueries[]> {
        params = Object.assign({ page: 0, limit: 10 }, params);

        return this.request$('GET', environment.apiUrl, `/inquiries`, params).pipe(
            map((res) => res.list.map(inquiries => new Inqueries(inquiries))),
        );
    }

    getInquerieDetail(id: string): Observable<Inqueries> {
        return this.request$('GET', environment.apiUrl, `/inquiries/${id}`).pipe(
            map((res) => res.map(inquiries => new Inqueries(inquiries))),
        );
    }

    postInqueries(data: any): Observable<any> {
        return this.request$('POST', environment.apiUrl, `/inquiries`, {}, data).pipe(
            map((res) => new Inqueries(res)),
        );
    }

    postInquiry(data: any): Observable<any> {
        const params = {
            UserID: data['author'],
            Title: data['title'],
            Content: data['content'],
            Category: data['category']
        }
        return this.request1$('POST', environment.localUrl, '/client/ask/register', params);
    }
    /* ----- CUSTOMER SUPPORT -----*/

    /* ----- WEB TOON -----*/
    searchItem(params: { query: string, page?: number, limit?: number }) {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/titles` : `/public/titles`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
        );
    }

    getTitles(id: string) {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const path = `/client/webtoon/detail`;
                const params = {
                    id,
                    UserID: parseInt(profile['body'].data.data.user_id, 10)
                };
                const data = this.request1$('GET', environment.localUrl, path, params).pipe(
                    map(res => {
                        return res['body'].data.data;
                    })
                ).pipe(
                    map(title => {
                        title['isFavorite'] = title['isValid'];
                        return title;
                    })
                )

                data.subscribe(res => {
                    console.log('KSL', 'title', res);
                });

                return data;
            })
        );
    }

    getNTitles(id: string) {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const path = `/client/webnovel/detail`;
                const params = {
                    id,
                    UserID: parseInt(profile['body'].data.data.user_id, 10)
                };
                return this.request1$('GET', environment.localUrl, path, params).pipe(
                    map(res => {
                        return res['body'].data.data;
                    })
                );
            })
        );
    }

    getGenreTitles(params: { genre: string, page?: number, count?: number }): Observable<any> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                params['genres'] = [params['genre']];

                const path = `/client/webtoon/search`;
                return this.request1$('GET', environment.localUrl, path, { ...params });
            }),
        );
    }

    getGenreNTitles(params: { genre: string, page?: number, count?: number }): Observable<any> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                params['genres'] = [params['genre']];

                const path = `/client/webnovel/search`;
                return this.request1$('GET', environment.localUrl, path, { ...params });
            }),
        );
    }


    getEpisodes(params: { id?: string, page?: number, limit?: number, sort?: string })
        : Observable<{ page: number, limit: number, total: number, sort?: string, list: Episode[] }> {

        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const path = '/client/webtoon/episode/search';
                params['UserID'] = parseInt(profile['body'].data.data.user_id, 10);

                return this.request1$('GET', environment.localUrl, path, params).pipe(
                    map(res => {
                        res = res['body'].data.data;
                        // tslint:disable-next-line:one-variable-per-declaration
                        const total = res['total'];
                        const rawData = res['list'];
                        const page = res['page'];
                        const limit = res['limit'];
                        const sort = res['sort'];

                        // ({total, list: rawData, page, limit, sort} = res);
                        const list: Episode[] = rawData.map((episode: Episode) => episode);
                        return { page, limit, total, sort, list } ;
                    })
                );
            })
        );
    }

    getNEpisodes(params: { user_id: number, id?: string, page?: number, limit?: number, sort?: string }): Observable<{ page: number, limit: number, total: number, sort?: string, list: Episode[] }> {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const path = '/client/webnovel/episode/search';
                params['UserID'] = parseInt(profile['body'].data.data.user_id, 10);

                return this.request1$('GET', environment.localUrl, path, params).pipe(
                    map(res => {
                        res = res['body'].data.data;
                        // tslint:disable-next-line:one-variable-per-declaration
                        const total = res['total'];
                        const rawData = res['list'];
                        const page = res['page'];
                        const limit = res['limit'];
                        const sort = res['sort'];

                        // ({total, list: rawData, page, limit, sort} = res);
                        const list: Episode[] = rawData.map((episode: Episode) => episode);
                        return { page, limit, total, sort, list } ;
                    })
                );
            })
        );
    }

    postOrders(params: { episodeId?: number, type?: string }): Observable<Title> {
        // type : 소장 또는 대여 ('purchase' | 'rent')
        params = Object.assign({ episodeId: 1, type: 'purchase'}, params);
        return this.request$('POST', environment.apiUrl, `/orders`, {}, params).pipe(
            map(res => res.map((comic: Title) => comic)),
        );
    }

    getEpisodeDetail(id: string) {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const path = `/client/webtoon/episode/cuts/search`;
                const params = {
                    episode_id: id,
                    UserID: profile['body'].data.data.user_id
                };
                return this.request1$('GET', environment.localUrl, path, params);
            })
        ).pipe(
            map(res => {
                return res['body'].data.data;
            })
        );
    }

    getNEpisodeDetail(id: string) {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const path = `/client/webnovel/episode/cuts/search`;
                const params = {
                    episode_id: id,
                    UserID: profile['body'].data.data.user_id
                };
                return this.request1$('GET', environment.localUrl, path, params);
            })
        ).pipe(
            map(res => {
                return res['body'].data.data;
            })
        );
        // return this.isAuthenticated$().pipe(
        //     switchMap(isAuth => {
        //         const path = `/client/webnovel/episode/cuts/search`;
        //         const params = {};
        //         params['episode_id'] = id;
        //         return this.request1$('GET', environment.localUrl, path, params);
        //     }),
        //     map((res) => {
        //         return res['body'].data.data;
        //     }),
        // );
    }

    getFirstEpisode(titleId: string): Observable<any> {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                    const param = {};
                    param['id'] = titleId;
                    param['limit'] = 1;
                    param['page'] = 0;
                    param['sort'] = 'asc';
                    param['UserID'] = profile['body'].data.data.user_id;
                    const path = `/client/webtoon/episode/search`;
                    const data = this.request1$('GET', environment.localUrl, path, { ...param }).pipe(
                        map(episode => {
                            const epi = episode['body'].data.data.list[0];
                            return {
                                createdAt: epi['createdAt'],
                                deletedAt: epi['deletedAt'],
                                purchasedAt: epi['validFrom'],
                                expiredAt: epi['expiredAt'],
                                cuts: [],
                                free: epi['isFree'],
                                id: epi['id'],
                                isFree: epi['isFree'],
                                isNew: epi['isNew'],
                                isPurchased: epi['isPurchased'],
                                isValid: epi['validFrom'] > 0,
                                isViewed: epi['isViewd'],
                                name: epi['name'],
                                no: epi['no'],
                                price: {
                                    currency: epi['price']['currency'],
                                    rent: epi['price']['rent'],
                                    buy: epi['price']['buy']
                                },
                                status: epi['status'],
                                thumbnail: epi['thumbnail'],
                                title: epi['title'],
                                titleId: epi['titleId'],
                                updatedAt: epi['updatedAt'],
                                validFrom: epi['validFrom'],
                                validUntil: epi['validUntil'],
                                prevId: epi['prevId'],
                                nextId: epi['nextId'],
                                displayPrice: {
                                    currency: epi['displayPrice']['currency'],
                                    rent: epi['displayPrice']['rent'],
                                    buy: epi['displayPrice']['buy']
                                },
                            };
                        })
                    );
                    return data;
            })
        );
    }

    getFirstNEpisode(titleId: string): Observable<any> {
        return this.getAllcomicsProfile().pipe(
            switchMap(profile => {
                const param = {};
                param['id'] = titleId;
                param['limit'] = 1;
                param['page'] = 0;
                param['sort'] = 'asc';
                param['UserID'] = profile['body'].data.data.user_id;
                const path = `/client/webnovel/episode/search`;
                const data = this.request1$('GET', environment.localUrl, path, { ...param }).pipe(
                    map(episode => {
                        const epi = episode['body'].data.data.list[0];
                        return {
                            createdAt: epi['createdAt'],
                            deletedAt: epi['deletedAt'],
                            purchasedAt: epi['validFrom'],
                            expiredAt: epi['expiredAt'],
                            cuts: [],
                            free: epi['isFree'],
                            id: epi['id'],
                            isFree: epi['isFree'],
                            isNew: epi['isNew'],
                            isPurchased: epi['isPurchased'],
                            isValid: epi['validFrom'] > 0,
                            isViewed: epi['isViewd'],
                            name: epi['name'],
                            no: epi['no'],
                            price: {
                                currency: epi['price']['currency'],
                                rent: epi['price']['rent'],
                                buy: epi['price']['buy']
                            },
                            status: epi['status'],
                            thumbnail: epi['thumbnail'],
                            title: epi['title'],
                            titleId: epi['titleId'],
                            updatedAt: epi['updatedAt'],
                            validFrom: epi['validFrom'],
                            validUntil: epi['validUntil'],
                            prevId: epi['prevId'],
                            nextId: epi['nextId'],
                            displayPrice: {
                                currency: epi['displayPrice']['currency'],
                                rent: epi['displayPrice']['rent'],
                                buy: epi['displayPrice']['buy']
                            },
                        };
                    })
                );
                return data;
            })
        );
    }

    postFavorites(titleId: string): Observable<Title> {
        return this.request$('POST', environment.apiUrl, `/titles/${titleId}/favorites`).pipe(
            map(res => res.map((comic: Title) => comic)),
        );
    }

    deleteFavoriteById(id: string): Observable<any> {
        return this.request$('DELETE', environment.apiUrl, `/titles/${id}/favorites`);
    }
    /* ----- WEB TOON -----*/

    getExchange$(currency: string) {
        const defaultRatio = CURRENCY_RATIO['USD'];
        const defaultDecimal = 2;
        return of({ source: currency, target: 'ContentCoin', ratio: CURRENCY_RATIO[currency] || defaultRatio, decimal: defaultDecimal }).pipe(delay(100));
    }

    getExchange(currency: string) {
        const defaultRatio = CURRENCY_RATIO['USD'];
        const defaultDecimal = 2;
        return { source: currency, target: 'ContentCoin', ratio: CURRENCY_RATIO[currency] || defaultRatio, decimal: defaultDecimal };
    }

    payEpisode(episodeId: any, payData) {
        // const data = this.request$('POST', environment.apiUrl, `/episodes/${episodeId}/pay`, {}, { ...payData });
        // data.subscribe(res => {
        //     console.log('data', res);
        // });
        // return data;
        return this.request1$('POST', environment.localUrl, '/client/buy/register', payData);
    }

    // Banner
    getBanners(param: any = {}) {

        const data = this.request1$('POST', environment.localUrl, '/client/banner/search', param);

        return data.pipe(
            map(banner => {
                const resp = banner['body'].data.data;
                return {
                    total: resp['total'],
                    language: 'ko',
                    list: resp['banner'].map(arr => {
                        return {
                            img_url: arr['imageURL'],
                            redirect_url: arr['link_type'] === 'external' ? arr['link'] : environment.baseUrl + arr['link']
                        };
                    })
                };
            })
        );

        // return this.isAuthenticated$().pipe(
        //     switchMap(isAuth => {
        //     }),
        // );
    }

    getDetailBanner(id: string) {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/banners/${id}` : `/public/banners/${id}`;
                return this.request$('GET', environment.apiUrl, path);
            }),
        );
    }

    // Message
    addMessage(data: any) {
        return this.request$('POST', environment.apiUrl, `/boards/0`, {}, { ...data });
    }

    getMessageById(id: any) {
        // return this.isAuthenticated$().pipe(
        //     switchMap(isAuth => {
        //         const path = isAuth ? `/boards/${id}` : `/public/boards/${id}`;
        //         return this.request$('GET', environment.apiUrl, path);
        //     })
        // );
        return this.request1$('POST', environment.localUrl, '/client/ask/detail', {AskID: id} );
    }

    getMessageList(param: any = { page: 0 }) {
        const params = {
            page: param['page'] + 1,
            count: param['limit']
        };

        return this.request1$('POST', environment.localUrl, '/client/notice/search', params).pipe(
            map(res => {
                return {
                    total: param['limit'],
                    list: res['body'].data.data.asks.map((ask) => {
                        return {
                            author: 'Admin',
                            authorId: '',
                            category: 'notice',
                            content: ask['content'],
                            title: ask['title'],
                            createdAt: ask['createdAt'],
                            updatedAt: ask['updatedAt'],
                            language: 'ko',
                            id: ask['noticeID']
                        };
                    })
                };
            })
        );
    }

    getMessageListFreq(param: any = { page: 0 }) {
        const params = {
            page: param['page'] + 1,
            count: param['limit']
        };

        return this.request1$('POST', environment.localUrl, '/client/qna/search', params).pipe(
            map(res => {
                return {
                    total: param['limit'],
                    list: res['body'].data.data.list.map((freq) => {
                        return {
                            author: 'Admin',
                            authorId: '',
                            category: 'freq',
                            content: freq['content'],
                            title: freq['title'],
                            createdAt: freq['createdAt'],
                            updatedAt: freq['updatedAt'],
                            language: 'ko',
                            id: freq['QnAID']
                        };
                    })
                };
            })
        );
    }

    getMessageListUser(param: any = { page: 0 }) {
        const params = {
            page: param['page'] + 1,
            count: param['limit'],
            UserID: param['UserID']
        };

        return this.request1$('POST', environment.localUrl, '/client/ask/search', params).pipe(
            map(res => {
                return {
                    total: param['limit'],
                    list: res['body'].data.data.asks.map((ask) => {
                        return {
                            author: 'Admin',
                            authorId: '',
                            category: 'Category',
                            content: ask['Content'],
                            title: ask['Title'],
                            createdAt: ask['CreatedAt'],
                            updatedAt: ask['UpdatedAt'],
                            language: 'ko',
                            id: ask['AskID'],
                            status: (ask['Status'] === 1 ? 'replied' : 'waiting')
                        };
                    })
                };
            })
        );
    }

    updateMessage(id: string, data: Message) {
        return this.request$('PUT', environment.apiUrl, `/boards/${id}`, {}, { ...data });
    }

    deleteMessage(id: string) {
        return this.request$('DELETE', environment.apiUrl, `/boards/${id}`);
    }

    // TDN API
    getTDNGraph() {
        return this.request$('GET', environment.apiUrl, `/tdn`);
    }

    getTDNBalance() {
        // return this.request$('GET', environment.apiUrl, `/tdn/0/balance`);
        return [100];
    }

    chargeTDN(body: any = {}) {
        body['pgName'] = '';
        body['tdn'] = body['tdn'].toFixed(3);
        body['amount'] = body['amount'].toFixed(3);
        return this.request$('POST', environment.localUrl, `/client/charge`, {}, { ...body });
        // return this.request$('POST', environment.apiUrl, `/tdn/0/charge`, {}, { ...body });
    }

    getTDNHistory$(params: any = {}) {
        return this.getAllcomicsProfile().pipe(
            switchMap(res => {
                const param = {
                    UserID: res['body'].data.data.user_id
                };
                return this.request1$('POST', environment.localUrl, '/client/payment/detail', param);
            }),
            map(res => {
                return {
                    limit: 10,
                    page: 0,
                    total: 10,
                    sort: '!createdAt',
                    list: res['body'].data.data.map(charge => {
                        return {
                            // amount: charge['default_coin'] + charge['bonus_coin'],
                            amount: charge['formattedPrice'],
                            chargedAt: charge['purchaseTime'],
                            currency: 'contentcoin',
                            tdn: charge['default_coin'] + charge['bonus_coin'],
                        };
                    })
                };
            }),
            catchError(() => {
                return of({
                    total: 0,
                    limit: 10,
                    page: 0,
                    sort: 'createdAt',
                    list: []
                });
            }),
        );
    }

    private deleteUndefinedProperty(query: any) {
        Object.keys(query).forEach(key => (query[key] === undefined || query[key] === '') && delete query[key]);
        return query;
    }

}
