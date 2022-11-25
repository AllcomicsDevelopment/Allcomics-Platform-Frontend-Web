import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubcriseDialogComponent } from './unsubcrise-dialog.component';

describe('UnsubcriseDialogComponent', () => {
  let component: UnsubcriseDialogComponent;
  let fixture: ComponentFixture<UnsubcriseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubcriseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubcriseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
