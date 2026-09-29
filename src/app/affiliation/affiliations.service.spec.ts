import { TestBed } from '@angular/core/testing';

import { AffiliationsService } from './affiliations.service';

import { beforeEach, describe, expect, it } from 'vitest';

describe('AffiliationsService', () => {
  let service: AffiliationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffiliationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns affiliations valid for a year', () => {
    const affiliations = service.At(3055);

    expect(affiliations.length).toBeGreaterThan(0);
    expect(affiliations.every(affiliation => affiliation.Subaffiliations !== undefined)).toBe(true);
  });
});