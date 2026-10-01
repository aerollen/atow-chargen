import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage3Component } from './stage3.component';
import { AppModule } from '../../../app.module';
import { ReplaySubject } from 'rxjs';
import { AffiliationInfo } from '../../../affiliation/affiliation';
import { EducationInfo, EducationService } from '../../../education/education.service';
import { EducationType } from '../../../education/education';
import { SkillField } from '../../../education/field';
import { RngService } from '../../../utils/rng.service';
import { Archtype, Attribute, Book, Eternal, Experience, Requirement, Skill, Statistic } from '../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('Stage3Component', () => {
  let component: Stage3Component;
  let fixture: ComponentFixture<Stage3Component>;
  let startingYear: ReplaySubject<Eternal>;
  let endingYear: ReplaySubject<Eternal>;
  let language: ReplaySubject<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>;
  let affiliation: AffiliationInfo;
  let education: EducationInfo;
  let basicField: SkillField;
  let secondBasicField: SkillField;

  const select = (selector: string, index: number) => {
    const element = fixture.nativeElement.querySelector(selector) as HTMLSelectElement;
    element.selectedIndex = index;
    element.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  const selectBackground = () => select('#bkg', 1);

  beforeEach(() => {
    const citation = { Book: Book.ATimeOfWar, Page: 1 as const };
    const backgroundRequirement: Requirement = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Op: '>=',
      Level: 3
    };
    const fieldRequirement: Requirement = {
      Kind: Statistic.Skill,
      Skill: Skill.Acting,
      Op: '>=',
      Level: 1
    };
    basicField = {
      Name: 'Basic field A',
      Prereq: fieldRequirement,
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Acting }]
    };
    secondBasicField = {
      Name: 'Basic field B',
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Artillery }]
    };
    const advancedField: SkillField = {
      Name: 'Advanced field',
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Administration }]
    };
    const specialField: SkillField = {
      Name: 'Special field',
      Skills: [{ Kind: Statistic.Skill, Skill: Skill.Archery }]
    };
    startingYear = new ReplaySubject<Eternal>(1);
    startingYear.next(3050 as Eternal);
    endingYear = new ReplaySubject<Eternal>(1);
    endingYear.next(3060 as Eternal);
    language = new ReplaySubject(1);
    affiliation = {
      Name: 'Starting affiliation',
      Cost: 0,
      Experience: [{ Kind: Statistic.Attribute, Attribute: Attribute.Charisma, Quantity: 15 }],
      PrimaryLanguage: { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' },
      SecondaryLanguages: [],
      Protocol: { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Starting protocol' },
      Citation: citation
    };
    education = {
      Name: 'Test education',
      Cost: 100,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 },
        { Pick: { Count: 2, Options: [{ Kind: Statistic.Attribute, Attribute: Attribute.Body }] }, Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 20 }
      ],
      Prereq: backgroundRequirement,
      Citation: citation,
      [EducationType.Basic]: { Duration: 2, Options: [basicField, secondBasicField] },
      [EducationType.Advanced]: { Duration: 3, Options: [advancedField] },
      [EducationType.Special]: { Duration: 1, Options: [specialField] }
    };

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage3Component],
      providers: [
        { provide: EducationService, useValue: { At: () => [education] } },
        { provide: RngService, useValue: { Roll: () => 3 } }
      ]
    });
    fixture = TestBed.createComponent(Stage3Component);
    component = fixture.componentInstance;
    component.startingYear = startingYear;
    component.endingYear = endingYear;
    component.archtype = Archtype.Academic;
    component.affiliation = affiliation;
    component.language = language;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads education backgrounds for the initialized starting year', () => {
    expect(component.currentStartingYear).toBe(3050);
    expect(component.currentEndingYear).toBe(3060);
    expect(component.backgrounds).toEqual([education]);
  });

  it('updates the selected education, subtotal, and backgroundChanged output', () => {
    let changedEducation: EducationInfo | undefined;
    component.backgroundChanged.subscribe(value => changedEducation = value);

    selectBackground();

    expect(component.currentBackground).toBe(education);
    expect(component.subtotal).toBe(55);
    expect(component.EducationFields[EducationType.Basic]).toEqual([basicField, secondBasicField]);
    expect(changedEducation).toBe(education);
  });

  it('allocates 30 experience per selected field skill and reports its prerequisite', () => {
    selectBackground();
    select('#lvl-1', 1);

    expect(component.fixedBasicExperience).toEqual([
      { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 30 }
    ]);
    expect(component.Requirments).toEqual([education.Prereq, basicField.Prereq]);
    expect(component.excludeEduOpt(component.EducationFields[EducationType.Basic], basicField))
      .toEqual([secondBasicField]);
  });

  it('clears dependent education selections and allocations when an earlier level changes', () => {
    selectBackground();
    component.educationIndex = {
      [EducationType.Basic]: 0,
      [EducationType.Advanced]: 0,
      [EducationType.Special]: 0
    };
    component.fixedBasicExperience = [{ Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 30 }];
    component.fixedAdvExperience = [{ Kind: Statistic.Skill, Skill: Skill.Administration, Quantity: 30 }];
    component.fixedSpecExperience = [{ Kind: Statistic.Skill, Skill: Skill.Archery, Quantity: 30 }];

    component.update(EducationType.Advanced);

    expect(component.educationIndex[EducationType.Basic]).toBe(0);
    expect(component.educationIndex[EducationType.Advanced]).toBeUndefined();
    expect(component.educationIndex[EducationType.Special]).toBeUndefined();
    expect(component.fixedAdvExperience).toEqual([]);
    expect(component.fixedSpecExperience).toEqual([]);

    component.educationIndex[EducationType.Advanced] = 0;
    component.educationIndex[EducationType.Special] = 0;
    component.update(EducationType.Basic);

    expect(component.educationIndex[EducationType.Basic]).toBeUndefined();
    expect(component.educationIndex[EducationType.Advanced]).toBeUndefined();
    expect(component.educationIndex[EducationType.Special]).toBeUndefined();
    expect(component.fixedBasicExperience).toEqual([]);
    expect(component.fixedAdvExperience).toEqual([]);
    expect(component.fixedSpecExperience).toEqual([]);
  });

  it('calculates affiliation year from selected education durations', () => {
    selectBackground();
    select('#lvl-1', 1);

    expect(component.affYear).toBe(3052);
    select('#nextEdu', 2);
    expect(component.affYear).toBe(3055);
  });

  it('disables next education options that would exceed the ending year', () => {
    endingYear.next(3053 as Eternal);
    fixture.detectChanges();
    selectBackground();
    select('#lvl-1', 1);

    const advancedOption = (fixture.nativeElement.querySelector('#nextEdu') as HTMLSelectElement).options[2];
    expect(advancedOption.textContent?.trim()).toBe('Advanced');
    expect(advancedOption.disabled).toBe(true);
  });

  it('resolves protocol and language placeholders from the affiliation and language inputs', () => {
    selectBackground();

    expect(component.fixedBackgroundExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Protocol,
      Subskill: 'Starting protocol',
      Quantity: 15
    });
    expect(component.fixedBackgroundExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: '!',
      Quantity: 20
    });

    language.next({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 20
    });
    fixture.detectChanges();

    expect(component.fixedBackgroundExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 20
    });
  });

  it('requires the required fields, life event, and new affiliation when enabled', () => {
    component.exp = { isComplete: true } as never;
    component.rle = { isComplete: true } as never;
    component.firstFieldExp = { isComplete: true } as never;
    component.nextEdu = { nativeElement: { value: 'Complete' } } as never;

    expect(component.isComplete).toBe(true);

    component.nextEdu = { nativeElement: { value: 'Advanced' } } as never;
    component.secondFieldExp = { isComplete: false } as never;
    expect(component.isComplete).toBe(false);

    component.secondFieldExp = { isComplete: true } as never;
    component.changeAffState = 'on';
    component.newaff = { isComplete: false } as never;
    expect(component.isComplete).toBe(false);

    component.newaff = { isComplete: true } as never;
    expect(component.isComplete).toBe(true);
  });
});
