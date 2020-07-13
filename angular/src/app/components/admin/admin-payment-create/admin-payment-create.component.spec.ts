import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentCreateComponent } from './admin-payment-create.component';

describe('AdminPaymentCreateComponent', () => {
  let component: AdminPaymentCreateComponent;
  let fixture: ComponentFixture<AdminPaymentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPaymentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
