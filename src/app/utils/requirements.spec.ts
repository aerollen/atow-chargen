import { describe, expect, it } from 'vitest';
import { Attribute, Requirement, Statistic } from './common';
import { matchesAffiliationRequirement, matchesBackgroundRequirement, requirementsForDisplay } from './requirements';

describe('requirementsForDisplay', () => {
  it('hides weaker matching bounds without removing tracked requirements', () => {
    const weaker: Requirement = {
      Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 4
    };
    const stronger: Requirement = {
      Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 5
    };
    const upperBound: Requirement = {
      Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '<=', Level: 8
    };
    const grouped: Requirement = {
      Or: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 6 },
        { Affiliation: 'Federated Suns' }
      ]
    };
    const requirements = [weaker, stronger, upperBound, grouped];

    expect(requirementsForDisplay(requirements)).toEqual([stronger, upperBound, grouped]);
    expect(requirements).toHaveLength(4);
  });
});

describe('matchesAffiliationRequirement', () => {
  it('matches direct and negated clanner requirements', () => {
    expect(matchesAffiliationRequirement({ IsClanner: true }, 'Clan Wolf', true)).toBe(true);
    expect(matchesAffiliationRequirement({ IsClanner: true }, 'Draconis Combine', false)).toBe(false);
    expect(matchesAffiliationRequirement({ Not: { IsClanner: true } }, 'Draconis Combine', false)).toBe(true);
    expect(matchesAffiliationRequirement({ Not: { IsClanner: true } }, 'Clan Wolf', true)).toBe(false);
  });

  it('respects clanner requirements inside And and Or groups', () => {
    const requirement: Requirement = {
      And: [
        { IsClanner: true },
        { Or: [{ IsClanner: false }, { IsClanner: true }] }
      ]
    };

    expect(matchesAffiliationRequirement(requirement, 'Clan Wolf', true)).toBe(true);
    expect(matchesAffiliationRequirement(requirement, 'Draconis Combine', false)).toBe(false);
  });

  it('leaves unrelated requirements unresolved rather than filtering them', () => {
    expect(matchesAffiliationRequirement({ Field: 'Clan Apprenticeship' }, 'Draconis Combine', false)).toBe(true);
    expect(matchesAffiliationRequirement({
      And: [{ IsClanner: true }, { Field: 'Clan Apprenticeship' }]
    }, 'Draconis Combine', false)).toBe(false);
    expect(matchesAffiliationRequirement({
      Or: [{ IsClanner: true }, { Field: 'Clan Apprenticeship' }]
    }, 'Draconis Combine', false)).toBe(true);
  });

  it('respects named affiliation alternatives alongside Clan eligibility', () => {
    const requirement: Requirement = {
      Or: [
        { Affiliation: 'ComStar' },
        { Affiliation: 'Word of Blake' },
        { IsClanner: true }
      ]
    };

    expect(matchesAffiliationRequirement(requirement, 'ComStar', false)).toBe(true);
    expect(matchesAffiliationRequirement(requirement, 'Draconis Combine', false)).toBe(false);
    expect(matchesAffiliationRequirement(requirement, 'Draconis Combine', true)).toBe(true);
  });
});

describe('matchesBackgroundRequirement', () => {
  it('matches selected stage backgrounds inside negated and grouped requirements', () => {
    const requirement: Requirement = {
      And: [
        { Not: { Stage: 1, Name: 'Fugitives' } },
        { Or: [{ Stage: 1, Name: 'Wanderers' }, { Stage: 1, Name: 'Nobility' }] }
      ]
    };

    expect(matchesBackgroundRequirement(requirement, { 1: 'Fugitives' })).toBe(false);
    expect(matchesBackgroundRequirement(requirement, { 1: 'Wanderers' })).toBe(true);
  });

  it('leaves requirements for unselected stages unresolved rather than filtering them', () => {
    expect(matchesBackgroundRequirement({ Stage: 1, Name: 'Fugitives' }, {})).toBe(true);
  });
});
