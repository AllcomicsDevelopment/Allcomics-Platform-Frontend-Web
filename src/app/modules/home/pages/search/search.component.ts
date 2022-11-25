import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';

import { TemplateInfo } from '@app/models/templateInfo';

import { EventService } from '@core/services/event.service';
import { ComicService } from '@core/services/comic.service';

import { Title } from '@app/models/title';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Position, ScrollService } from '@core/services/scroll.service';
import { isNull } from 'util';

import * as fromSearch from '../../store/search/search.reducer';
import * as SearchActions from '../../store/search/search.actions';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    public templateInfo: TemplateInfo;
    results: Title[];
    keyWord: string;

    public lastScrollTop = 0;
    public page$: Observable<number>;
    public list$: Observable<Title[]>;
    public totalPage$: Observable<number>;
    public isFetching$: Observable<boolean>;
    public total$: Observable<number>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private eventService: EventService,
                private comicService: ComicService,
                private scrollService: ScrollService,
                private translate: TranslateService,
                private searchStore$: Store<fromSearch.State>,
                private route: Router) { }

    ngOnInit() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 5;
        this.templateInfo.txtTitle = '';

        this.setupReducerListener();
        this.setupScrolledDownEventListener();

        this.eventService.on('doSearch').subscribe((keyWord) => {
            this.keyWord = keyWord;
            this.getWebtoons({ query: `*${keyWord}*`, page: 0, limit: 10 });
            // this.comicService.searchItem({query: `*${keyWord}*`, page: 0, limit: 10}).subscribe(res => {
            //     const { list } = res;
            //     this.results = list;
            //     this.keyWord = keyWord;
            // });
        });
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    getTranslateGenre(genres: any) {
        return genres ? genres.map(genre => this.translate.instant(`common.genre.${genre}`)) : [];
    }

    onShowDetail(id: string) {
        this.route.navigateByUrl('/webtoon/detail/' + id);
    }

    private setupReducerListener() {
        this.total$ = this.searchStore$.pipe(select(fromSearch.getSearchedTotal), takeUntil(this.destroyed$));
        this.page$ = this.searchStore$.pipe(select(fromSearch.getSearchedPage), takeUntil(this.destroyed$));
        this.totalPage$ = this.searchStore$.pipe(select(fromSearch.getSearchedTotalPage), takeUntil(this.destroyed$));
        this.isFetching$ = this.searchStore$.pipe(select(fromSearch.getIsFetching), takeUntil(this.destroyed$));
        this.list$ = this.searchStore$.pipe(select(fromSearch.getSearchedList), takeUntil(this.destroyed$));
        this.list$.subscribe(res => this.results = res);
    }

    private setupScrolledDownEventListener() {
        const shouldFetch$ = this.scrollService.onScrolledDown$.pipe(
            withLatestFrom(this.isFetching$, this.page$, this.totalPage$),
            filter(([positions, isFetching, page, totalPage]) => !!!isFetching),
            filter(([positions, isFetching, page, totalPage]) => page + 1 <= totalPage),
            map(([positions, isFetching, page, totalPage]) => page),
            takeUntil(this.destroyed$)
        );
        shouldFetch$.subscribe(page => this.getWebtoons({ query: `*${this.keyWord}*`, page: page + 1, limit: 10 }));
    }

    getWebtoons(params: any = {}) {
        this.searchStore$.dispatch(SearchActions.FetchWebtoonList({ params }));
    }
}
