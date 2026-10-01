import { Field } from './field';
import { Attribute, Book, Eternal, Skill, Statistic } from '../utils/common';

import { describe, expect, it } from 'vitest';

describe('Field', () => {
  const fieldInfo = {
    Name: 'Pilot',
    Skills: [{ Kind: Statistic.Skill, Skill: Skill.Piloting }],
    Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op: '>=', Level: 3 } as const,
    Citation: { Book: Book.ATimeOfWar, Page: 70 as const }
  };

  it('should create an instance', () => {
    expect(new Field(2398, { Name: '', Skills: [] })).toBeTruthy();
  });

  it('is unavailable before founding and available from its founding year', () => {
    const field = new Field(2400, fieldInfo);

    expect(field.At(1 as Eternal)).toBeUndefined();
    expect(field.At(2 as Eternal)).toEqual(fieldInfo);
    expect(field.At(3 as Eternal)).toEqual(fieldInfo);
  });

  it('returns undefined before a field founded in 2398', () => {
    const field = new Field(2398, fieldInfo);

    expect(field.At(-1 as Eternal)).toBeUndefined();
  });

  it('returns stable results when years are queried out of order', () => {
    const field = new Field(2400, fieldInfo);

    const afterFounding = field.At(2 as Eternal);
    const beforeFounding = field.At(1 as Eternal);
    const repeatedAfterFounding = field.At(2 as Eternal);

    expect(beforeFounding).toBeUndefined();
    expect(repeatedAfterFounding).toEqual(afterFounding);
  });
});
