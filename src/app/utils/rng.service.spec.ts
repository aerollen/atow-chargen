import { TestBed } from '@angular/core/testing';

import { RngService } from './rng.service';
import { AppModule } from '../app.module';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('RngService', () => {
  let service: RngService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(RngService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('maps equal-width random buckets to each die face', () => {
    const random = vi.spyOn(Math, 'random');

    for (let face = 1; face <= 6; face++) {
      random.mockReturnValueOnce((face - 1) / 6);
      expect(service.Roll()).toBe(face);
    }
  });

  it('returns the lowest and highest face at the random range boundaries', () => {
    const random = vi.spyOn(Math, 'random');

    random.mockReturnValueOnce(0);
    expect(service.Roll()).toBe(1);

    random.mockReturnValueOnce(1 - Number.EPSILON);
    expect(service.Roll()).toBe(6);
  });

  it('uses a fresh random value for each roll', () => {
    const random = vi.spyOn(Math, 'random');
    random.mockReturnValueOnce(0).mockReturnValueOnce(0.999);

    expect([service.Roll(), service.Roll()]).toEqual([1, 6]);
  });
});
