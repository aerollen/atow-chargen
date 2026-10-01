import { ExpPipe } from './exp.pipe';
import { Attribute, Experience, Skill, Statistic, Trait } from './common';

import { describe, expect, it } from 'vitest';

describe('ExpPipe', () => {
  it('create an instance', () => {
    const pipe = new ExpPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns a fallback for missing experience', () => {
    expect(new ExpPipe().transform(undefined)).toBe('undefined');
  });

  it('formats positive, zero, and negative attribute quantities', () => {
    const pipe = new ExpPipe();

    expect(pipe.transform({ Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 100 }))
      .toBe('Strength +100 EXP');
    expect(pipe.transform({ Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 0 }))
      .toBe('Body 0 EXP');
    expect(pipe.transform({ Kind: Statistic.Attribute, Attribute: Attribute.Edge, Quantity: -25 }))
      .toBe('Edge -25 EXP');
  });

  it('formats specialized skill and trait labels', () => {
    const pipe = new ExpPipe();

    expect(pipe.transform({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'English',
      Quantity: 20
    })).toBe('Language/English +20 EXP');
    expect(pipe.transform({
      Kind: Statistic.Trait,
      Trait: Trait.Compulsion,
      Trigger: 'Paranoia',
      Quantity: -10
    })).toBe('Compulsion/Paranoia -10 EXP');
  });

  it('uses placeholders for choice-based experience variants', () => {
    const pipe = new ExpPipe();
    const choices: Experience[] = [
      { Or: [{ Kind: Statistic.Attribute, Attribute: Attribute.Strength }], Quantity: 5 },
      { Pick: { Count: 2, Options: [{ Kind: Statistic.Skill, Skill: Skill.Acting }] }, Quantity: 10 },
      { Set: { Options: [{ Kind: Statistic.Trait, Trait: Trait.Fit }] }, Quantity: 15 },
      {
        Kind: Statistic.Attribute,
        Attribute: Attribute.Body,
        Quantity: 20,
        If: { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Op: '>', Level: 0 }
      }
    ];

    expect(choices.map(choice => pipe.transform(choice))).toEqual(['Or?!', 'Pick?!', 'Set?!', 'If?!']);
  });
});
