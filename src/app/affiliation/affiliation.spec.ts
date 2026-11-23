import { Attribute, Book, Eternal, Requirement, Skill, Statistic } from '../utils/common';
import { Affiliation } from './affiliation';
import { AffiliationInfo } from './affiliation';

import { describe, expect, it } from 'vitest';

describe('Affiliation', () => {
  const info: AffiliationInfo = {
    Name: 'Draconis Combine',
    Cost: 150,
    ChildLabor: true,
    Experience: [],
    PrimaryLanguage: {
      Skill: Skill.Language,
      Subskill: 'Japanese',
      Kind: Statistic.Skill
    },
    SecondaryLanguages: [],
    Citation: { Book: Book.ATimeOfWar, Page: 1 },
    Protocol: {
      Skill: Skill.Protocol,
      Subskill: 'Combine',
      Kind: Statistic.Skill
    }
  };

  it('should create an instance', () => {
    const affiliation = new Affiliation(2398, info);

    expect(affiliation.At(0 as Eternal)).toMatchObject({
      ...info,
      Subaffiliations: []
    });
  });

  it('returns undefined before the affiliation is founded', () => {
    const affiliation = new Affiliation(2398, info);

    expect(affiliation.At(-1 as Eternal)).toBeUndefined();
  });

  it('preserves affiliation prerequisites across timeline updates', () => {
    const requirement: Requirement = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Intelligence,
      Op: '>=',
      Level: 4
    };
    const affiliation = new Affiliation(2398, { ...info, Prereq: requirement })
      .Update(2500, { Name: 'Updated affiliation' });

    expect(affiliation.At(102 as Eternal)?.Prereq).toEqual(requirement);
    expect(affiliation.At(102 as Eternal)?.ChildLabor).toBe(true);
  });
});
