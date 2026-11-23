import type { AffiliationInfo } from '../affiliation/affiliation';
import { Experience, Requirement, Skill, Statistic, Stat } from './common';

type AffiliationSubskills = Pick<AffiliationInfo, 'PrimaryLanguage' | 'Protocol'>;

export function resolveStatSubskill<T extends Stat>(
  stat: T,
  affiliation?: AffiliationSubskills,
  languageSubskill?: string
): T {
  if (!affiliation || stat.Kind !== Statistic.Skill || !('Subskill' in stat) || stat.Subskill !== '!') {
    return stat;
  }

  switch (stat.Skill) {
    case Skill.Protocol:
    case Skill.Streetwise:
      return { ...stat, Subskill: affiliation.Protocol.Subskill } as T;
    case Skill.Language:
      return {
        ...stat,
        Subskill: languageSubskill ?? affiliation.PrimaryLanguage.Subskill
      } as T;
    default:
      return stat;
  }
}

export function resolveRequirementSubskills<T extends Requirement>(
  requirement: T | undefined,
  affiliation?: AffiliationSubskills,
  languageSubskill?: string
): T | undefined {
  if (!requirement || !affiliation) return requirement;

  if ('Kind' in requirement) {
    return resolveStatSubskill(requirement as Stat, affiliation, languageSubskill) as T;
  }
  if ('Not' in requirement) {
    return {
      ...requirement,
      Not: resolveRequirementSubskills(requirement.Not, affiliation, languageSubskill)!
    } as T;
  }
  if ('And' in requirement) {
    return {
      ...requirement,
      And: requirement.And.map(child =>
        resolveRequirementSubskills(child, affiliation, languageSubskill)!)
    } as T;
  }
  if ('Or' in requirement) {
    return {
      ...requirement,
      Or: requirement.Or.map(child =>
        resolveRequirementSubskills(child, affiliation, languageSubskill)!)
    } as T;
  }
  return requirement;
}

export function resolveExperienceSubskills(
  experience: Experience,
  affiliation?: AffiliationSubskills,
  languageSubskill?: string
): Experience {
  if (!affiliation) return experience;

  const resolvedIf = experience.If
    ? resolveRequirementSubskills(experience.If, affiliation, languageSubskill)
    : undefined;
  const ifClause = resolvedIf ? { If: resolvedIf } : {};

  if ('Kind' in experience) {
    return {
      ...experience,
      ...resolveStatSubskill(experience, affiliation, languageSubskill),
      ...ifClause
    };
  }
  if ('Or' in experience) {
    return {
      ...experience,
      Or: experience.Or.map(option => resolveStatSubskill(option, affiliation, languageSubskill)),
      ...ifClause
    };
  }
  if ('Pick' in experience) {
    return {
      ...experience,
      Pick: {
        ...experience.Pick,
        Options: experience.Pick.Options.map(option =>
          resolveStatSubskill(option, affiliation, languageSubskill))
      },
      ...ifClause
    };
  }
  if ('Set' in experience) {
    return {
      ...experience,
      Set: {
        ...experience.Set,
        Options: experience.Set.Options.map(option =>
          resolveStatSubskill(option, affiliation, languageSubskill))
      },
      ...ifClause
    };
  }
  return experience;
}

export function resolveExperienceListSubskills(
  experiences: Experience[],
  affiliation?: AffiliationSubskills,
  languageSubskill?: string
): Experience[] {
  return experiences.map(experience =>
    resolveExperienceSubskills(experience, affiliation, languageSubskill));
}
