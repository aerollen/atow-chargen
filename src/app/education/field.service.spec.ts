import { TestBed } from '@angular/core/testing';

import { FieldService } from './field.service';
import { Field, SkillField } from './field';
import { Attribute, Book, Skill, Statistic } from '../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('FieldService', () => {
  let service: FieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('filters fields by founding year and converts calendar years correctly', () => {
    service.Fields = [
      new Field(2398, { Name: 'Existing field', Skills: [] }),
      new Field(2400, { Name: 'Later field', Skills: [] })
    ];

    expect(service.At(2399).map(field => field.Name)).toEqual(['Existing field']);
    expect(service.At(2400).map(field => field.Name)).toEqual(['Existing field', 'Later field']);
  });

  it('preserves field skills, prerequisites, and citations', () => {
    const field: SkillField = {
      Name: 'Pilot',
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Piloting }],
      Prereq: { Kind: Statistic.Attribute, Attribute: Attribute.Intelligence, Op: '>=', Level: 3 },
      Citation: { Book: Book.ATimeOfWar, Page: 70 }
    };
    service.Fields = [new Field(2398, field)];

    expect(service.At(2400)).toEqual([field]);
  });

  it('returns an empty list when there are no fields', () => {
    service.Fields = [];

    expect(service.At(3055)).toEqual([]);
  });

  it('returns stable results when years are queried out of order', () => {
    service.Fields = [
      new Field(2398, { Name: 'Early field', Skills: [] }),
      new Field(2400, { Name: 'Later field', Skills: [] })
    ];

    const afterLaterFounding = service.At(2400);
    const beforeLaterFounding = service.At(2399);
    const repeatedAfterLaterFounding = service.At(2400);

    expect(beforeLaterFounding.map(field => field.Name)).toEqual(['Early field']);
    expect(repeatedAfterLaterFounding).toEqual(afterLaterFounding);
  });
});
