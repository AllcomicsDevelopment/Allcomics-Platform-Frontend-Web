import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBillingDialogComponent } from './to-billing-dialog.component';

describe('ToBillingDialogComponent', () => {
  let component: ToBillingDialogComponent;
  let fixture: ComponentFixture<ToBillingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToBillingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToBillingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
