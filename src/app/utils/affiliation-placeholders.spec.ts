import { AffiliationInfo } from '../affiliation/affiliation';
import { Experience, Requirement, Skill, Statistic } from './common';
import { resolveExperienceSubskills, resolveRequirementSubskills } from './affiliation-placeholders';

import { describe, expect, it } from 'vitest';

describe('affiliation placeholder resolution', () => {
  const affiliation = {
    Protocol: { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan' },
    PrimaryLanguage: { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Mandarin Chinese' }
  } as Pick<AffiliationInfo, 'Protocol' | 'PrimaryLanguage'>;

  it('resolves placeholders throughout nested experience and its condition', () => {
    const experience: Experience = {
      Pick: {
        Count: 1,
        Options: [
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!' },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!' }
        ]
      },
      Quantity: 10,
      If: {
        And: [
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Op: '>=', Exp: 10 }
        ]
      }
    };

    const resolved = resolveExperienceSubskills(experience, affiliation, 'Cantonese');

    expect(resolved).toEqual({
      Pick: {
        Count: 1,
        Options: [
          { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan' },
          { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Cantonese' }
        ]
      },
      Quantity: 10,
      If: {
        And: [
          { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: 'Capellan', Op: '>=', Exp: 10 }
        ]
      }
    });
    expect(experience.Pick?.Options[0]).toMatchObject({ Subskill: '!' });
  });

  it('resolves placeholders through nested requirements and defaults language to the affiliation', () => {
    const requirement: Requirement = {
      Or: [
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Op: '>=', Exp: 10 },
        {
          Not: {
            And: [
              { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Op: '>=', Exp: 5 }
            ]
          }
        }
      ]
    };

    expect(resolveRequirementSubskills(requirement, affiliation)).toEqual({
      Or: [
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Capellan', Op: '>=', Exp: 10 },
        {
          Not: {
            And: [
              { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Mandarin Chinese', Op: '>=', Exp: 5 }
            ]
          }
        }
      ]
    });
  });
});
