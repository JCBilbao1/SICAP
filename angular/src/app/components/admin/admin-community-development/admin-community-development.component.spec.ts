import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommunityDevelopmentComponent } from './admin-community-development.component';

describe('AdminCommunityDevelopmentComponent', () => {
  let component: AdminCommunityDevelopmentComponent;
  let fixture: ComponentFixture<AdminCommunityDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCommunityDevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCommunityDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
