import { TestBed } from '@angular/core/testing';

import { AffiliationsService } from './affiliations.service';
import { AppModule } from '../app.module';

describe('AffiliationsService', () => {
  let service: AffiliationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(AffiliationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
