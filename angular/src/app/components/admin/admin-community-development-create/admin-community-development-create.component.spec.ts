import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommunityDevelopmentCreateComponent } from './admin-community-development-create.component';

describe('AdminCommunityDevelopmentCreateComponent', () => {
  let component: AdminCommunityDevelopmentCreateComponent;
  let fixture: ComponentFixture<AdminCommunityDevelopmentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCommunityDevelopmentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCommunityDevelopmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
