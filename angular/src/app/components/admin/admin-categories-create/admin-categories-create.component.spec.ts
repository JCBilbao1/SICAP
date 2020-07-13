import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoriesCreateComponent } from './admin-categories-create.component';

describe('AdminCategoriesCreateComponent', () => {
  let component: AdminCategoriesCreateComponent;
  let fixture: ComponentFixture<AdminCategoriesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCategoriesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCategoriesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
