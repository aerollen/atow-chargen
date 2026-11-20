import { beforeEach, describe, expect, it } from 'vitest';
import { EducationType } from '../education/education';
import { Attribute, Requirement, Skill, Statistic } from './common';
import { RequirementPipe } from './requirement.pipe';

describe('RequirementPipe', () => {
  let pipe: RequirementPipe;

  beforeEach(() => {
    pipe = new RequirementPipe();
  });

  it('formats stat and grouped requirements', () => {
    const requirement: Requirement = {
      And: [
        { Not: { Stage: 1, Name: 'Fugitives' } },
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 4 },
        { Kind: Statistic.Skill, Skill: Skill.Leadership, Op: '>=', Exp: 150 }
      ]
    };

    expect(pipe.transform(requirement)).toBe(
      'All of: Not (Stage 1: Fugitives); Strength >= 4; Leadership >= 150 XP'
    );
  });

  it('formats alternatives as bullets', () => {
    expect(pipe.transform({
      Or: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>=', Level: 4 },
        { Kind: Statistic.Skill, Skill: Skill.Leadership, Op: '>=', Exp: 150 }
      ]
    })).toBe('One of:\n  - Strength >= 4\n  - Leadership >= 150 XP');
  });

  it('separates stat labels from their operators and values', () => {
    const requirement: Requirement = {
      Kind: Statistic.Skill, Skill: Skill.Leadership, Op: '>=', Exp: 150
    };

    expect(pipe.transform(requirement, 'label')).toBe('Leadership');
    expect(pipe.transform(requirement, 'operator')).toBe('>= 150 XP');
  });

  it('formats education, affiliation, and affiliation-type requirements', () => {
    expect(pipe.transform({ Field: { Level: EducationType.Advanced, Count: 2 } }))
      .toBe('Advanced field (count 2)');
    expect(pipe.transform({ Affiliation: 'Federated Suns' })).toBe('Affiliation: Federated Suns');
    expect(pipe.transform({ IsClanner: false })).toBe('Requires a non-Clan affiliation');
    expect(pipe.transform({ IsInner: true })).toBe('Requires an Inner Sphere affiliation');
    expect(pipe.transform({ IsPerifphery: true })).toBe('Requires a Periphery affiliation');
  });
});
