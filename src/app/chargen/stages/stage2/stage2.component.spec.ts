import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage2Component } from './stage2.component';
import { AppModule } from '../../../app.module';
import { ReplaySubject } from 'rxjs';
import { AffiliationInfo } from '../../../affiliation/affiliation';
import { BackgroundInfo } from '../../../background/background';
import { BackgroundsService } from '../../../background/backgrounds.service';
import { RngService } from '../../../utils/rng.service';
import { Archtype, Attribute, Book, Eternal, Experience, Skill, Statistic } from '../../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('Stage2Component', () => {
  let component: Stage2Component;
  let fixture: ComponentFixture<Stage2Component>;
  let startingYear: ReplaySubject<Eternal>;
  let language: ReplaySubject<Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string }>;
  let affiliation: AffiliationInfo;
  let background: BackgroundInfo;

  const select = (selector: string, index: number) => {
    const element = fixture.nativeElement.querySelector(selector) as HTMLSelectElement;
    element.selectedIndex = index;
    element.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(() => {
    const citation = { Book: Book.ATimeOfWar, Page: 1 as const };
    startingYear = new ReplaySubject<Eternal>(1);
    startingYear.next(3051 as Eternal);
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
        { Kind: Statistic.Skill, Skill: Skill.Streetwise, Subskill: '!', Quantity: 15 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: '!', Quantity: 20 }
      ],
      Citation: citation
    };

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [Stage2Component],
      providers: [
        {
          provide: BackgroundsService,
          useValue: { At: (_year: number, stage: number) => stage === 2 ? [background] : [] }
        },
        { provide: RngService, useValue: { Roll: () => 3 } }
      ]
    });
    fixture = TestBed.createComponent(Stage2Component);
    component = fixture.componentInstance;
    component.startingYear = startingYear;
    component.archtype = Archtype.Academic;
    component.affiliation = affiliation;
    component.language = language;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads backgrounds for stage 2 and the current starting year', () => {
    expect(component.currentStartingYear).toBe(3051);
    expect(component.backgrounds).toEqual([background]);
  });

  it('updates the selected background, subtotal, and backgroundChanged output', () => {
    let changedBackground: BackgroundInfo | undefined;
    component.backgroundChanged.subscribe(value => changedBackground = value);

    select('#bkg', 1);

    expect(component.currentBackground).toBe(background);
    expect(component.subtotal).toBe(70);
    expect(changedBackground).toBe(background);
  });

  it('resolves protocol, streetwise, and language placeholders', () => {
    select('#bkg', 1);

    expect(component.fixedBackgroundExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Protocol,
      Subskill: 'Starting protocol',
      Quantity: 15
    });
    expect(component.fixedBackgroundExperience).toContainEqual({
      Kind: Statistic.Skill,
      Skill: Skill.Streetwise,
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

  it('updates affiliation year when the starting year changes', () => {
    const years: Eternal[] = [];
    component.affYearChanged.subscribe(year => years.push(year));

    select('#bkg', 1);
    expect(component.affYear).toBe(3055);

    startingYear.next(3060 as Eternal);
    fixture.detectChanges();

    expect(component.currentStartingYear).toBe(3060);
    expect(component.affYear).toBe(3064);
    expect(years).toEqual([3051, 3064]);
  });

  it('requires the background and life event, plus a new affiliation when enabled', () => {
    component.exp = { isComplete: true } as never;
    component.rle = { isComplete: true } as never;

    expect(component.isComplete).toBe(true);

    component.changeAffState = 'on';
    component.newaff = { isComplete: false } as never;
    expect(component.isComplete).toBe(false);

    component.newaff = { isComplete: true } as never;
    expect(component.isComplete).toBe(true);
  });

  it('excludes the starting affiliation and switches affiliation experience when toggled', () => {
    select('#bkg', 1);
    expect(component.affiliationExperience).toBe(affiliation.Experience);

    (fixture.nativeElement.querySelector('#changeAff') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(component.changeAffState).toBe('on');
    expect(component.newaff.excludedAffiliations).toEqual([affiliation]);
    expect(component.affiliationExperience).toEqual([]);

    (fixture.nativeElement.querySelector('#changeAff') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(component.changeAffState).toBe('off');
    expect(component.affiliationExperience).toBe(affiliation.Experience);
  });

  it('remains incomplete when hidden', () => {
    component.exp = { isComplete: true } as never;
    component.rle = { isComplete: true } as never;
    component.hidden = true;

    expect(component.isComplete).toBe(false);
  });
});
