import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRewardDetailComponent } from './admin-reward-detail.component';

describe('AdminRewardDetailComponent', () => {
  let component: AdminRewardDetailComponent;
  let fixture: ComponentFixture<AdminRewardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRewardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRewardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
