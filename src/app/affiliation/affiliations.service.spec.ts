import { TestBed } from '@angular/core/testing';
import { Attribute, Skill, Statistic, Trait } from '../utils/common';

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

  it('applies Era Report 3145 Draconis Combine rules', () => {
    const draconis = service.At(3145).find(affiliation => affiliation.Name === 'Draconis Combine');
    const azami = draconis?.Subaffiliations.find(subaffiliation => subaffiliation.Name === 'Azami');

    expect(draconis?.Experience).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Willpower,
      Quantity: 25
    });
    expect(draconis?.Experience).toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Compulsion,
      Trigger: 'Distrust of Draconis Combine',
      Quantity: 50
    });
    expect(draconis?.SecondaryLanguages).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Any Nova Cat Language'
    });
    expect(draconis?.Protocol.Subskill).toBe('Draconis Combine');
    expect(draconis?.FlexibleExperience).toEqual({ Quantity: 0, Options: [] });
    expect(azami?.Experience).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Willpower,
      Quantity: 100
    });
    expect(azami?.Experience).not.toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Wealth,
      Quantity: -25
    });
  });

  it('keeps Nova Cat District selectable through 3143 only', () => {
    const novaCatAt3143 = service.At(3143)
      .find(affiliation => affiliation.Name === 'Draconis Combine')
      ?.Subaffiliations.find(subaffiliation => subaffiliation.Name === 'Nova Cat District');
    const novaCatAt3144 = service.At(3144)
      .find(affiliation => affiliation.Name === 'Draconis Combine')
      ?.Subaffiliations.find(subaffiliation => subaffiliation.Name === 'Nova Cat District');

    expect(novaCatAt3143).toBeDefined();
    expect(novaCatAt3144).toBeUndefined();
  });

  it('uses the Rasalhague District name and Edge modifier from the rules', () => {
    const rasalhague = service.At(2398)
      .find(affiliation => affiliation.Name === 'Draconis Combine')
      ?.Subaffiliations.find(subaffiliation => subaffiliation.Name === 'Rasalhague District');

    expect(rasalhague?.Experience).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Edge,
      Quantity: -40
    });
  });
});