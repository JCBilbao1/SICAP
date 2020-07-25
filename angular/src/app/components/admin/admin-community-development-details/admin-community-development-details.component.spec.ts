import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommunityDevelopmentDetailsComponent } from './admin-community-development-details.component';

describe('AdminCommunityDevelopmentDetailsComponent', () => {
  let component: AdminCommunityDevelopmentDetailsComponent;
  let fixture: ComponentFixture<AdminCommunityDevelopmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCommunityDevelopmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCommunityDevelopmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
