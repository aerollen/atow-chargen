import { TestBed } from '@angular/core/testing';

import { EducationService } from './education.service';
import { Education, EducationType, EduInfo } from './education';
import { FieldService } from './field.service';
import { SkillField } from './field';
import { Attribute, Book, Eternal, Skill, Statistic } from '../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('EducationService', () => {
  let service: EducationService;
  let availableFields: SkillField[];
  let requestedYears: number[];
  let education: Education;

  const basicField: SkillField = {
    Name: 'Basic field',
    Skills: [{ Kind: Statistic.Skill, Skill: Skill.Acting }]
  };
  const advancedField: SkillField = {
    Name: 'Advanced field',
    Skills: [{ Kind: Statistic.Skill, Skill: Skill.Computers }]
  };
  const specialField: SkillField = {
    Name: 'Special field',
    Skills: [{ Kind: Statistic.Skill, Skill: Skill.Archery }]
  };

  beforeEach(() => {
    availableFields = [basicField, advancedField, specialField];
    requestedYears = [];
    TestBed.configureTestingModule({
      providers: [{
        provide: FieldService,
        useValue: {
          At: (year: number) => {
            requestedYears.push(year);
            return availableFields;
          }
        }
      }]
    });
    service = TestBed.inject(EducationService);
    const info: EduInfo = {
      Name: 'Test education',
      Cost: 250,
      Experience: [{ Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 }],
      Citation: { Book: Book.ATimeOfWar, Page: 12 },
      [EducationType.Basic]: { Duration: 1, Options: [{ Name: basicField.Name }, { Name: 'Missing field' }] },
      [EducationType.Advanced]: { Duration: 2, Options: [{ Name: advancedField.Name }] },
      [EducationType.Special]: { Duration: 3, Options: [{ Name: specialField.Name }] }
    };
    education = new Education(2400, info);
    service.Educations = [education];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns no education before its founding year and includes it from that year', () => {
    expect(service.At(2399)).toEqual([]);
    expect(service.At(2400)).toHaveLength(1);
  });

  it('resolves fields by level and preserves education metadata and durations', () => {
    const [result] = service.At(2400);

    expect(result).toMatchObject({
      Name: 'Test education',
      Cost: 250,
      Experience: [{ Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 }],
      Citation: { Book: Book.ATimeOfWar, Page: 12 }
    });
    expect(result[EducationType.Basic]).toEqual({ Duration: 1, Options: [basicField] });
    expect(result[EducationType.Advanced]).toEqual({ Duration: 2, Options: [advancedField] });
    expect(result[EducationType.Special]).toEqual({ Duration: 3, Options: [specialField] });
  });

  it('uses fields available for the requested year', () => {
    const earlierField: SkillField = {
      Name: basicField.Name,
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Acting }]
    };
    const laterField: SkillField = {
      Name: basicField.Name,
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Administration }]
    };
    availableFields = [earlierField];
    const earlier = service.At(2400)[0];

    availableFields = [laterField];
    const later = service.At(2401)[0];

    expect(earlier[EducationType.Basic]?.Options).toEqual([earlierField]);
    expect(later[EducationType.Basic]?.Options).toEqual([laterField]);
    expect(requestedYears).toEqual([2400, 2401]);
  });

  it('returns an empty list when there are no education timelines', () => {
    service.Educations = [];

    expect(service.At(3055)).toEqual([]);
  });
});
