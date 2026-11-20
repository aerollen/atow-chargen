import { TestBed } from '@angular/core/testing';
import { Attribute, Book, Skill, Statistic, Trait } from '../utils/common';

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

  it('applies Federated Suns base profiles at their year boundaries', () => {
    const at = (year: number) => service.At(year)
      .find(affiliation => affiliation.Name === 'Federated Suns');

    expect(at(2398)?.Citation.Book).toBe(Book.ATimeOfWar);
    expect(at(2398)?.PrimaryLanguage.Subskill).toBe('English');
    expect(at(2398)?.SecondaryLanguages.map(language => language.Subskill))
      .toEqual(['French', 'German', 'Hindi', 'Russian']);
    expect(at(2398)?.Experience).toContainEqual({
      Or: [
        { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude, Skill: Skill.Protocol },
        { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude, Skill: Skill.Strategy }
      ],
      Quantity: 100
    });

    expect(at(2749)?.Citation.Book).toBe(Book.ATimeOfWar);
    expect(at(2750)?.Citation.Book).toBe(Book.EraReport2750);
    expect(at(2750)?.Experience).toContainEqual({
      Or: [
        { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude, Skill: Skill.Strategy },
        { Kind: Statistic.Trait, Trait: Trait.NaturalAptitude, Skill: Skill.Tactics }
      ],
      Quantity: 100
    });
    expect(at(3084)?.Citation.Book).toBe(Book.EraReport2750);
    expect(at(3085)?.Citation.Book).toBe(Book.FieldManual3085);
    expect(at(3094)?.Citation.Book).toBe(Book.FieldManual3085);
    expect(at(3095)?.Citation.Book).toBe(Book.EraReport3145);
    expect(at(3095)?.Experience).toEqual([]);
    expect(at(3095)?.SecondaryLanguages).toEqual([{
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: '*'
    }]);
  });

  it('renames Outback in 3080 and retains its rules until the 3135 sub-affiliation update', () => {
    const subaffiliationAt = (year: number, name: string) => service.At(year)
      .find(affiliation => affiliation.Name === 'Federated Suns')
      ?.Subaffiliations.find(subaffiliation => subaffiliation.Name === name);

    expect(subaffiliationAt(3079, 'Outback')).toBeDefined();
    expect(subaffiliationAt(3079, 'Periphery March')).toBeUndefined();
    expect(subaffiliationAt(3080, 'Outback')).toBeUndefined();
    expect(subaffiliationAt(3080, 'Periphery March')?.Citation.Book).toBe(Book.FieldManual3085);
    expect(subaffiliationAt(3085, 'Periphery March')?.Citation.Book).toBe(Book.FieldManual3085);
    expect(subaffiliationAt(3085, 'Crucis March')?.Citation.Book).toBe(Book.ATimeOfWar);
    expect(subaffiliationAt(3085, 'Periphery March')?.Experience).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 100
    });

    const capellanAt3134 = subaffiliationAt(3134, 'Capellan March');
    const capellanAt3135 = subaffiliationAt(3135, 'Capellan March');
    expect(subaffiliationAt(3135, 'Crucis March')?.Citation.Book).toBe(Book.ATimeOfWar);
    expect(capellanAt3134?.Citation.Book).toBe(Book.FieldManual3085);
    expect(capellanAt3134?.Experience).not.toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Equipped,
      Quantity: 50
    });
    expect(capellanAt3135?.Citation.Book).toBe(Book.EraReport3145);
    expect(capellanAt3135?.Experience).toContainEqual({
      Kind: Statistic.Trait,
      Trait: Trait.Equipped,
      Quantity: 50
    });

    const peripheryAt3135 = subaffiliationAt(3135, 'Periphery March');
    expect(peripheryAt3135?.Experience).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 50
    });
    expect(peripheryAt3135?.Experience).not.toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 100
    });
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