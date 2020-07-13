import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentDetailComponent } from './admin-payment-detail.component';

describe('AdminPaymentDetailComponent', () => {
  let component: AdminPaymentDetailComponent;
  let fixture: ComponentFixture<AdminPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
