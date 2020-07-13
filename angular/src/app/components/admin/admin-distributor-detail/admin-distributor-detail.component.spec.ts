import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDistributorDetailComponent } from './admin-distributor-detail.component';

describe('AdminDistributorDetailComponent', () => {
  let component: AdminDistributorDetailComponent;
  let fixture: ComponentFixture<AdminDistributorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDistributorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDistributorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
