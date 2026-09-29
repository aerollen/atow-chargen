import { Book, Eternal, Skill, Statistic } from '../utils/common';
import { Affiliation } from './affiliation';
import { AffiliationInfo } from './affiliation';

import { describe, expect, it } from 'vitest';

describe('Affiliation', () => {
  it('should create an instance', () => {
    const info: AffiliationInfo = {
      Name: 'Draconis Combine',
      Cost: 150,
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
    const affiliation = new Affiliation(2398, info);

    expect(affiliation.At(0 as Eternal)).toMatchObject({
      ...info,
      Subaffiliations: []
    });
  });
});
