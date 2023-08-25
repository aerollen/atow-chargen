import { TestBed } from '@angular/core/testing';

import { ArchtypeService } from './archtype.service';
import { AppModule } from '../app.module';

describe('ArchtypeService', () => {
  let service: ArchtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(ArchtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
