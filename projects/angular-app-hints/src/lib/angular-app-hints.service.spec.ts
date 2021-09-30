import { TestBed } from '@angular/core/testing';

import { AngularAppHintsService } from './angular-app-hints.service';

describe('AngularAppHintsService', () => {
  let service: AngularAppHintsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularAppHintsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
