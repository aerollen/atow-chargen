import { StatPipe } from './stat.pipe';
import { Acrobatics, Attribute, Piloting, Skill, Statistic, Trait } from './common';

import { describe, expect, it } from 'vitest';

describe('StatPipe', () => {
  it('create an instance', () => {
    const pipe = new StatPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns a fallback for missing stats', () => {
    expect(new StatPipe().transform(undefined)).toBe('undefined');
  });

  it('formats attributes and skills without subskills', () => {
    const pipe = new StatPipe();

    expect(pipe.transform({ Kind: Statistic.Attribute, Attribute: Attribute.Strength })).toBe('Strength');
    expect(pipe.transform({ Kind: Statistic.Skill, Skill: Skill.Leadership })).toBe('Leadership');
  });

  it('formats enum and string subskills', () => {
    const pipe = new StatPipe();

    expect(pipe.transform({
      Kind: Statistic.Skill,
      Skill: Skill.Piloting,
      Subskill: Piloting.Aerospace
    })).toBe('Piloting/Aerospace');
    expect(pipe.transform({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'English'
    })).toBe('Language/English');
    expect(pipe.transform({
      Kind: Statistic.Skill,
      Skill: Skill.Acrobatics,
      Subskill: Acrobatics.FreeFall
    })).toBe('Acrobatics/Free Fall');
  });

  it('formats skill specialties in parentheses', () => {
    expect(new StatPipe().transform({
      Kind: Statistic.Skill,
      Skill: Skill.Leadership,
      Speciality: 'Military'
    })).toBe('Leadership (Military)');
  });

  it('formats standard and specialized traits', () => {
    const pipe = new StatPipe();

    expect(pipe.transform({ Kind: Statistic.Trait, Trait: Trait.FastLearner })).toBe('Fast Learner');
    expect(pipe.transform({
      Kind: Statistic.Trait,
      Trait: Trait.Compulsion,
      Trigger: 'Paranoia'
    })).toBe('Compulsion/Paranoia');
    expect(pipe.transform({
      Kind: Statistic.Trait,
      Trait: Trait.ExceptionalAttribute,
      Attribute: Attribute.Edge
    })).toBe('Exceptional Attribute/Edge');
    expect(pipe.transform({
      Kind: Statistic.Trait,
      Trait: Trait.NaturalAptitude,
      Skill: Skill.Piloting
    })).toBe('Natural Aptitude/Piloting');
  });

  it('extracts parts of a formatted label', () => {
    const pipe = new StatPipe();
    const language = { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' } as const;

    expect(pipe.transform(language, { value: '/', index: 0 })).toBe('Language');
    expect(pipe.transform(language, { value: '/', index: 1 })).toBe('English');
  });
});
