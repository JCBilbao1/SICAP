import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkmRewardsComponent } from './skm-rewards.component';

describe('SkmRewardsComponent', () => {
  let component: SkmRewardsComponent;
  let fixture: ComponentFixture<SkmRewardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkmRewardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkmRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
