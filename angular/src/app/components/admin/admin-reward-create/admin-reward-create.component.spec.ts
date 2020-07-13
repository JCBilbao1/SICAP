import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRewardCreateComponent } from './admin-reward-create.component';

describe('AdminRewardCreateComponent', () => {
  let component: AdminRewardCreateComponent;
  let fixture: ComponentFixture<AdminRewardCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRewardCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRewardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
