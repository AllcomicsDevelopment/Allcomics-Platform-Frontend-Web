import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreByWebtoonComponent } from './genre-by-webtoon.component';

describe('GenreByWebtoonComponent', () => {
  let component: GenreByWebtoonComponent;
  let fixture: ComponentFixture<GenreByWebtoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreByWebtoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreByWebtoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
