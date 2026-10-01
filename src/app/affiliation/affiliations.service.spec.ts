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

  it('returns no affiliations before they are founded', () => {
    expect(service.At(2397)).toEqual([]);
  });

  it('applies affiliation updates starting in their effective year', () => {
    const beforeUpdate = service.At(3051).find(affiliation => affiliation.Name === 'Capellan Confideration');
    const afterUpdate = service.At(3052).find(affiliation => affiliation.Name === 'Capellan Confideration');

    expect(beforeUpdate?.Cost).toBe(150);
    expect(afterUpdate?.Cost).toBe(100);
  });

  it('returns subaffiliations with year-appropriate names and membership', () => {
    const beforeRename = service.At(3027)
      .find(affiliation => affiliation.Name === 'Capellan Confideration')?.Subaffiliations;
    const afterRename = service.At(3028)
      .find(affiliation => affiliation.Name === 'Capellan Confideration')?.Subaffiliations;
    const beforeRemoval = service.At(3039)
      .find(affiliation => affiliation.Name === 'Capellan Confideration')?.Subaffiliations;
    const afterRemoval = service.At(3040)
      .find(affiliation => affiliation.Name === 'Capellan Confideration')?.Subaffiliations;

    expect(beforeRename?.some(subaffiliation => subaffiliation.Name === 'St. Ives Commonality')).toBe(true);
    expect(afterRename?.some(subaffiliation => subaffiliation.Name === 'St. Ives Compact')).toBe(true);
    expect(beforeRemoval?.some(subaffiliation => subaffiliation.Name === 'Chesterson Commonality')).toBe(true);
    expect(afterRemoval?.some(subaffiliation => subaffiliation.Name === 'Chesterson Commonality')).toBe(false);
  });
});