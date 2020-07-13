import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoriesDetailComponent } from './admin-categories-detail.component';

describe('AdminCategoriesDetailComponent', () => {
  let component: AdminCategoriesDetailComponent;
  let fixture: ComponentFixture<AdminCategoriesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCategoriesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCategoriesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
