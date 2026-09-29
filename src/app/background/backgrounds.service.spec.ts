import { TestBed } from '@angular/core/testing';

import { BackgroundsService } from './backgrounds.service';

import { beforeEach, describe, expect, it } from 'vitest';

describe('BackgroundsService', () => {
  let service: BackgroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns backgrounds for the requested stage', () => {
    expect(service.At(3055, 1).length).toBeGreaterThan(0);
  });
});