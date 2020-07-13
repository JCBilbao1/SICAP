import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDistributorsComponent } from './admin-distributors.component';

describe('AdminDistributorsComponent', () => {
  let component: AdminDistributorsComponent;
  let fixture: ComponentFixture<AdminDistributorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDistributorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDistributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
