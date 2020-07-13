import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkmRewardDetailsComponent } from './skm-reward-details.component';

describe('SkmRewardDetailsComponent', () => {
  let component: SkmRewardDetailsComponent;
  let fixture: ComponentFixture<SkmRewardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkmRewardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkmRewardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
