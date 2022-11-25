import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubcriseComponent } from './unsubcrise.component';

describe('UnsubcriseComponent', () => {
  let component: UnsubcriseComponent;
  let fixture: ComponentFixture<UnsubcriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubcriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubcriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
