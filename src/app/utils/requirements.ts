import { Requirement, Stage, Statistic } from './common';

type RequirementBound = {
  key: string,
  unit: 'Level' | 'Exp',
  direction: 'lower' | 'upper',
  value: number,
  strict: boolean
};

function statRequirementKey(requirement: Requirement): string | undefined {
  if (!('Kind' in requirement)) return undefined;

  const strict = 'Strict' in requirement ? requirement.Strict : undefined;
  switch (requirement.Kind) {
    case Statistic.Attribute:
      return JSON.stringify([requirement.Kind, requirement.Attribute, strict]);
    case Statistic.Skill: {
      const subskill = 'Subskill' in requirement
        ? requirement.Subskill instanceof RegExp ? requirement.Subskill.source : String(requirement.Subskill)
        : undefined;
      const speciality = 'Speciality' in requirement ? requirement.Speciality : undefined;
      return JSON.stringify([requirement.Kind, requirement.Skill, subskill, speciality, strict]);
    }
    case Statistic.Trait:
      return JSON.stringify([
        requirement.Kind,
        requirement.Trait,
        'Trigger' in requirement ? requirement.Trigger : undefined,
        'Attribute' in requirement ? requirement.Attribute : undefined,
        'Skill' in requirement ? requirement.Skill : undefined,
        'Phenotype' in requirement ? requirement.Phenotype : undefined,
        'Identity' in requirement ? requirement.Identity : undefined,
        strict
      ]);
  }
}

function requirementBound(requirement: Requirement): RequirementBound | undefined {
  const key = statRequirementKey(requirement);
  if (!key || !('Op' in requirement)) return undefined;

  let unit: RequirementBound['unit'];
  let value: number;
  if ('Level' in requirement) {
    unit = 'Level';
    value = requirement.Level;
  } else if ('Exp' in requirement) {
    unit = 'Exp';
    value = requirement.Exp;
  } else {
    return undefined;
  }

  return {
    key,
    unit,
    value,
    direction: requirement.Op === '<' || requirement.Op === '<=' ? 'upper' : 'lower',
    strict: requirement.Op === '<' || requirement.Op === '>'
  };
}

function sameBound(left: RequirementBound, right: RequirementBound): boolean {
  return left.key === right.key &&
    left.unit === right.unit &&
    left.direction === right.direction &&
    left.value === right.value &&
    left.strict === right.strict;
}

function dominates(left: RequirementBound, right: RequirementBound): boolean {
  if (
    left.key !== right.key ||
    left.unit !== right.unit ||
    left.direction !== right.direction
  ) return false;

  if (left.direction === 'lower') {
    return left.value > right.value || (left.value === right.value && left.strict && !right.strict);
  }
  return left.value < right.value || (left.value === right.value && left.strict && !right.strict);
}

export function requirementsForDisplay(requirements: readonly Requirement[]): Requirement[] {
  const bounds = requirements.map(requirementBound);
  return requirements.filter((_, index) =>
    !requirements.some((_, otherIndex) => {
      if (index === otherIndex) return false;
      const current = bounds[index];
      const other = bounds[otherIndex];
      if (!current || !other) return false;
      return dominates(other, current) || (otherIndex < index && sameBound(other, current));
    })
  );
}

export function matchesAffiliationRequirement(
  requirement: Requirement | undefined,
  affiliationName: string,
  isClanner: boolean
): boolean {
  if (!requirement) return true;

  const evaluate = (current: Requirement): boolean | undefined => {
    if ('IsClanner' in current) return current.IsClanner === isClanner;
    if ('Affiliation' in current) return current.Affiliation === affiliationName;
    if ('Not' in current) {
      const result = evaluate(current.Not);
      return result === undefined ? undefined : !result;
    }
    if ('And' in current) {
      const results = current.And.map(evaluate);
      if (results.includes(false)) return false;
      return results.includes(undefined) ? undefined : true;
    }
    if ('Or' in current) {
      const results = current.Or.map(evaluate);
      if (results.includes(true)) return true;
      return results.includes(undefined) ? undefined : false;
    }
    return undefined;
  };

  return evaluate(requirement) !== false;
}

export function matchesBackgroundRequirement(
  requirement: Requirement | undefined,
  selectedBackgrounds: Partial<Record<Stage, string>>
): boolean {
  if (!requirement) return true;

  const evaluate = (current: Requirement): boolean | undefined => {
    if ('Stage' in current) {
      const selectedBackground = selectedBackgrounds[current.Stage];
      return selectedBackground === undefined ? undefined : selectedBackground === current.Name;
    }
    if ('Not' in current) {
      const result = evaluate(current.Not);
      return result === undefined ? undefined : !result;
    }
    if ('And' in current) {
      const results = current.And.map(evaluate);
      if (results.includes(false)) return false;
      return results.includes(undefined) ? undefined : true;
    }
    if ('Or' in current) {
      const results = current.Or.map(evaluate);
      if (results.includes(true)) return true;
      return results.includes(undefined) ? undefined : false;
    }
    return undefined;
  };

  return evaluate(requirement) !== false;
}
