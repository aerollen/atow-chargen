import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage4Component } from './stage4.component';
import { AppModule } from '../../../app.module';
import { ReplaySubject } from 'rxjs';
import { AffiliationInfo } from '../../../affiliation/affiliation';
import { BackgroundInfo, BackgroundOption } from '../../../background/background';
import { BackgroundsService } from '../../../background/backgrounds.service';
import { RngService } from '../../../utils/rng.service';
import { Archtype, Attribute, Book, Eternal, Experience, Skill, Statistic, Trait } from '../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('Stage4Component', () => {
  let component: Stage4Component;
  let fixture: ComponentFixture<Stage4Component>;
  let startingYear: ReplaySubject<Eternal>;
  let endingYear: ReplaySubject<Eternal>;
  let language: ReplaySubject<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>;
  let affiliation: AffiliationInfo;
  let background: BackgroundInfo;
  let alternateBackground: BackgroundInfo;

  const select = (selector: string, index: number) => {
    const element = fixture.nativeElement.querySelector(selector) as HTMLSelectElement;
    element.selectedIndex = index;
    element.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  const selectBackground = (index = 1) => select('#bkg', index);

  beforeEach(() => {
    const citation = { Book: Book.ATimeOfWar, Page: 1 as const };
    const optionalExperience: Experience[] = [
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 8 },
      { Kind: Statistic.Skill, Skill: Skill.Acting, Quantity: 10 },
      { Pick: { Count: 2, Options: [{ Kind: Statistic.Trait, Trait: Trait.Fit }] }, Quantity: 3 }
    ];
    const options: BackgroundOption[] = [
      { Name: 'Option A', Experience: optionalExperience, Citation: citation },
      { Name: 'Option B', Experience: [{ Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: 6 }], Citation: citation }
    ];
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
    background = {
      Name: 'Test background',
      Cost: 100,
      Duration: 4,
      Experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 10 },
        { Pick: { Count: 2, Options: [{ Kind: Statistic.Attribute, Attribute: Attribute.Body }] }, Quantity: 5 },
        { Kind: Statistic.Skill, Skill: Skill.Protocol, Subskill: '!', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 20 }
      ],
      Options: options,
      Citation: citation
    };
    alternateBackground = {
      Name: 'Alternate background',
      Cost: 80,
      Duration: 2,
      Experience: [{ Kind: Statistic.Attribute, Attribute: Attribute.Body, Quantity: 5 }],
      Options: [{ Name: 'Only option', Experience: [], Citation: citation }],
      Citation: citation
    };

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage4Component],
      providers: [
        {
          provide: BackgroundsService,
          useValue: { At: (_year: number, stage: number) => stage === 4 ? [background, alternateBackground] : [] }
        },
        { provide: RngService, useValue: { Roll: () => 3 } }
      ]
    });
    fixture = TestBed.createComponent(Stage4Component);
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

  it('loads stage 4 backgrounds for the initialized year', () => {
    expect(component.currentStartingYear).toBe(3050);
    expect(component.currentEndingYear).toBe(3060);
    expect(component.backgrounds).toEqual([background, alternateBackground]);
  });

  it('updates the selected background, subtotal, and backgroundChanged output', () => {
    let changedBackground: BackgroundInfo | undefined;
    component.backgroundChanged.subscribe(value => changedBackground = value);

    selectBackground();

    expect(component.currentBackground).toBe(background);
    expect(component.subtotal).toBe(55);
    expect(changedBackground).toBe(background);
  });

  it('updates the optional selection, subtotal, and experience', () => {
    let changedBackground: BackgroundInfo | undefined;
    component.backgroundChanged.subscribe(value => changedBackground = value);
    selectBackground();
    select('#bkgopt', 1);

    expect(component.currengBackgroundOption?.Name).toBe('Option A');
    expect(component.optionSubtotal).toBe(24);
    expect(component.fixedOptionExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: '!',
      Quantity: 8
    });
    expect(component.experience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Acting,
      Quantity: 10
    });
    expect(changedBackground).toBe(background);
  });

  it('clears the selected optional experience when the background changes', () => {
    selectBackground();
    select('#bkgopt', 2);
    expect(component.currengBackgroundOption?.Name).toBe('Option B');
    expect(component.fixedOptionExperience).toEqual([{ Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: 6 }]);

    selectBackground(2);

    expect(component.currentBackground).toBe(alternateBackground);
    expect(component.currentBackgroundOptionIndex).toBeUndefined();
    expect(component.currengBackgroundOption).toBeUndefined();
    expect(component.fixedOptionExperience).toEqual([]);
  });

  it('disables backgrounds that exceed the ending year and computes the affiliation year', () => {
    endingYear.next(3053 as Eternal);
    fixture.detectChanges();

    const backgroundSelect = fixture.nativeElement.querySelector('#bkg') as HTMLSelectElement;
    expect(backgroundSelect.options[1].disabled).toBe(true);
    expect(backgroundSelect.options[2].disabled).toBe(false);

    selectBackground(2);
    expect(component.affYear).toBe(3052);
  });

  it('resolves background and option language/protocol placeholders', () => {
    selectBackground();

    expect(component.fixedBackgroundExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Protocol,
      Subskill: 'Starting protocol',
      Quantity: 15
    });
    select('#bkgopt', 1);
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
    expect(component.fixedOptionExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 8
    });
  });

  it('requires the optional selection and a new affiliation when enabled', () => {
    selectBackground();
    component.exp = { isComplete: true, experience: [] } as never;
    component.rle = { isComplete: true, experience: [] } as never;

    expect(component.isComplete).toBe(false);

    select('#bkgopt', 1);
    component.exp = { isComplete: true, experience: [] } as never;
    component.rle = { isComplete: true, experience: [] } as never;
    component.optionalexp = { isComplete: true, experience: [] } as never;
    expect(component.isComplete).toBe(true);

    component.changeAffState = 'on';
    component.newaff = { isComplete: false } as never;
    expect(component.isComplete).toBe(false);
    component.newaff = { isComplete: true } as never;
    expect(component.isComplete).toBe(true);
  });
});
