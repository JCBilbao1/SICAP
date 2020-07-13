import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinMattersComponent } from './skin-matters.component';

describe('SkinMattersComponent', () => {
  let component: SkinMattersComponent;
  let fixture: ComponentFixture<SkinMattersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkinMattersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkinMattersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
