import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdolDialogComponent } from './idol-dialog.component';

describe('IdolDialogComponent', () => {
  let component: IdolDialogComponent;
  let fixture: ComponentFixture<IdolDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdolDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
