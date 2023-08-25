import { TestBed } from '@angular/core/testing';

import { RngService } from './rng.service';
import { AppModule } from '../app.module';

describe('RngService', () => {
  let service: RngService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(RngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
