import { TestBed } from '@angular/core/testing';

import { ArchtypeService } from './archtype.service';

describe('ArchtypeService', () => {
  let service: ArchtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
