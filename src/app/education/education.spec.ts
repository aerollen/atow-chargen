import { Education, EducationType, EduInfo } from './education';
import { Eternal, Skill, Statistic } from '../utils/common';
import { SkillField } from './field';

import { describe, expect, it } from 'vitest';

describe('Education', () => {
  const info: EduInfo = {
    Name: 'Test education',
    Cost: 100,
    Experience: [],
    [EducationType.Basic]: {
      Duration: 1,
      Options: [{ Name: 'Existing basic field' }, { Name: 'Removable basic field' }]
    },
    [EducationType.Advanced]: {
      Duration: 2,
      Options: [{ Name: 'Existing advanced field' }]
    }
  };

  it('should create an instance', () => {
    expect(new Education(2398, info)).toBeTruthy();
  });

  it('returns undefined before founding and the initial education at founding', () => {
    const education = new Education(2400, info);

    expect(education.At(1 as Eternal)).toBeUndefined();
    expect(education.At(2 as Eternal)).toMatchObject({
      Name: 'Test education',
      Cost: 100,
      Experience: [],
      [EducationType.Basic]: info[EducationType.Basic],
      [EducationType.Advanced]: info[EducationType.Advanced]
    });
  });

  it('adds a field only from its effective year and preserves other levels', () => {
    const addedField: SkillField = {
      Name: 'Added basic field',
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Acting }]
    };
    const education = new Education(2398, info).AddField(2400, EducationType.Basic, addedField);

    expect(education.At(1 as Eternal)?.[EducationType.Basic]?.Options.map(field => field.Name)).toEqual([
      'Existing basic field',
      'Removable basic field'
    ]);
    expect(education.At(2 as Eternal)?.[EducationType.Basic]?.Options).toEqual([
      ...info[EducationType.Basic]!.Options,
      addedField
    ]);
    expect(education.At(2 as Eternal)?.[EducationType.Advanced]).toEqual(info[EducationType.Advanced]);
  });

  it('removes only the named field from the requested level', () => {
    const education = new Education(2398, info)
      .RemoveField(2400, EducationType.Basic, 'Removable basic field');

    expect(education.At(1 as Eternal)?.[EducationType.Basic]?.Options.map(field => field.Name)).toEqual([
      'Existing basic field',
      'Removable basic field'
    ]);
    expect(education.At(2 as Eternal)?.[EducationType.Basic]?.Options.map(field => field.Name)).toEqual([
      'Existing basic field'
    ]);
    expect(education.At(2 as Eternal)?.[EducationType.Advanced]).toEqual(info[EducationType.Advanced]);
  });

  it('returns stable snapshots when fields are added and later removed', () => {
    const addedField: SkillField = {
      Name: 'Temporary field',
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Artillery }]
    };
    const education = new Education(2398, info)
      .AddField(2400, EducationType.Basic, addedField)
      .RemoveField(2402, EducationType.Basic, addedField.Name);

    const afterRemoval = education.At(4 as Eternal);
    const beforeAddition = education.At(1 as Eternal);
    const afterAddition = education.At(2 as Eternal);
    const repeatedAfterRemoval = education.At(4 as Eternal);

    expect(beforeAddition?.[EducationType.Basic]?.Options.map(field => field.Name)).not.toContain(addedField.Name);
    expect(afterAddition?.[EducationType.Basic]?.Options.map(field => field.Name)).toContain(addedField.Name);
    expect(afterRemoval?.[EducationType.Basic]?.Options.map(field => field.Name)).not.toContain(addedField.Name);
    expect(repeatedAfterRemoval).toEqual(afterRemoval);
  });
});
