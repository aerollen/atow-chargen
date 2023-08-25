import { TestBed } from '@angular/core/testing';

import { BackgroundsService } from './backgrounds.service';
import { AppModule } from '../app.module';

describe('BackgroundsService', () => {
  let service: BackgroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(BackgroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
