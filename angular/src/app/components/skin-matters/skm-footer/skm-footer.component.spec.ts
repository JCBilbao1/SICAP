import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkmFooterComponent } from './skm-footer.component';

describe('SkmFooterComponent', () => {
  let component: SkmFooterComponent;
  let fixture: ComponentFixture<SkmFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkmFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkmFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
