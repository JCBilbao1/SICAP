import { TestBed } from '@angular/core/testing';

import { RouterExtService } from './router-ext.service';

describe('RouterExtService', () => {
  let service: RouterExtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterExtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
