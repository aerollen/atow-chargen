import { Skill, Statistic } from '../utils/common';
import { Affiliation } from './affiliation';

describe('Affiliation', () => {
  it('should create an instance', () => {
    expect(new Affiliation(2398, {
      Name: 'Draconis Combine',
      Cost: 150,
      PrimaryLanguage: {
        Skill: Skill.Language,
        Subskill: 'TODO',
        Kind: Statistic.Skill },
      SecondaryLanguages: [],
      Experience: []
    })).toBeTruthy();
  });
});
