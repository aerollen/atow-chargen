import { Requirement, Stage } from './common';

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
