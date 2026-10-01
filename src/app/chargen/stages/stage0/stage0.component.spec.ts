import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage0Component } from './stage0.component';
import { AppModule } from '../../../app.module';
import { AffiliationInfo, Subaffiliation } from '../../../affiliation/affiliation';
import { AffiliationsService } from '../../../affiliation/affiliations.service';
import { Archtype, Attribute, Book, Experience, Skill, Statistic } from '../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

type TestAffiliation = AffiliationInfo & Record<'Subaffiliations', Subaffiliation[]>;

describe('Stage0Component', () => {
  let component: Stage0Component;
  let fixture: ComponentFixture<Stage0Component>;
  let affiliation: TestAffiliation;

  const selectOption = (selector: string, index: number) => {
    const select = fixture.nativeElement.querySelector(selector) as HTMLSelectElement;
    select.selectedIndex = index;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  const selectAffiliationAndSubaffiliation = () => {
    selectOption('#aff', 1);
    selectOption('#subaff', 1);
  };

  const selectLanguage = () => selectOption('li.lang select[title="or"]', 1);

  beforeEach(() => {
    const citation = { Book: Book.ATimeOfWar, Page: 1 as const };
    const primaryLanguage = { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian' } as const;
    affiliation = {
      Name: 'Test affiliation',
      Cost: 0,
      Experience: [{ Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 25 }],
      PrimaryLanguage: primaryLanguage,
      SecondaryLanguages: [{ Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'English' }],
      Protocol: { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: 'Test' },
      Citation: citation,
      Subaffiliations: [{ Name: 'Test region', Experience: [], Citation: citation }]
    };

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage0Component],
      providers: [{
        provide: AffiliationsService,
        useValue: { At: () => [affiliation] }
      }]
    });
    fixture = TestBed.createComponent(Stage0Component);
    component = fixture.componentInstance;
    component.archtype = Archtype.Academic;
    component.startingYear = 3051;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts incomplete with only default experience and no language options', () => {
    expect(component.currentAffiliation).toBeUndefined();
    expect(component.languages).toEqual([]);
    expect(component.isComplete).toBe(false);
    expect(component.experience).toHaveLength(10);
  });

  it('provides language choices and delegates affiliation data after selection', () => {
    selectOption('#aff', 1);

    expect(component.currentAffiliation).toBe(affiliation);
    expect(component.languages).toEqual([affiliation.PrimaryLanguage, ...affiliation.SecondaryLanguages]);
    expect(component.affiliationExperience).toEqual(affiliation.Experience);
    expect(component.affiliationRequirments).toEqual([]);
  });

  it('adds the selected language to experience and emits languageChanged', () => {
    const changedLanguages: Experience[] = [];
    component.languageChanged.subscribe(language => changedLanguages.push(language));
    selectOption('#aff', 1);
    selectLanguage();

    const selectedLanguage = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 20
    };
    expect(component.experience).toContainEqual(selectedLanguage);
    expect(changedLanguages).toEqual([selectedLanguage]);
  });

  it('emits complete only after affiliation and language choices are complete', () => {
    const completedExperience: Experience[][] = [];
    const changes: unknown[] = [];
    component.complete.subscribe(experience => completedExperience.push(experience));
    component.changed.subscribe(value => changes.push(value));
    selectAffiliationAndSubaffiliation();

    expect(component.isComplete).toBe(false);
    expect(completedExperience).toHaveLength(0);
    expect(changes.length).toBeGreaterThan(0);

    selectLanguage();

    expect(component.isComplete).toBe(true);
    expect(completedExperience).toHaveLength(1);
    expect(completedExperience[0]).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 20
    });
    expect(completedExperience[0]).toContainEqual({
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 100
    });
  });

  it('hides and restores the stage after completion', () => {
    selectAffiliationAndSubaffiliation();
    selectLanguage();

    const toggle = fixture.nativeElement.querySelector('#toggleVisibilityStage0') as HTMLInputElement;
    const stageContent = fixture.nativeElement.querySelector('h1 + div') as HTMLDivElement;
    expect(toggle.value).toBe('hide');
    toggle.click();
    fixture.detectChanges();

    expect(component.visible).toBe(false);
    expect(stageContent.hidden).toBe(true);
    expect(toggle.value).toBe('show');

    toggle.click();
    fixture.detectChanges();

    expect(component.visible).toBe(true);
  expect(stageContent.hidden).toBe(false);
  });
});