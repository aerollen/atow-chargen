import { TestBed } from '@angular/core/testing';

import { AffiliationsService } from './affiliations.service';

describe('AffiliationsService', () => {
  let service: AffiliationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffiliationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
