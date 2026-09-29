import { TestBed } from '@angular/core/testing';

import { EducationService } from './education.service';

import { beforeEach, describe, expect, it } from 'vitest';

describe('EducationService', () => {
  let service: EducationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
