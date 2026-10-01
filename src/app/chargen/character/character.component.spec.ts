import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterComponent } from './character.component';
import { AppModule } from '../../app.module';
import { Character, Option } from '../../character/character';
import { of } from 'rxjs';
import { Attribute, Eternal, Experience, Skill, Statistic, Trait } from '../../utils/common';

import { beforeEach, describe, expect, it } from 'vitest';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [CharacterComponent]
    });
    
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    component.character = new Character({ Option: Option.Create });
  
    fixture.detectChanges(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps stage 0 affiliation experience when later stages retain that affiliation', () => {
    const selectedSubaffiliationExperience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Charisma,
      Quantity: 75
    } as Experience;
    const affiliation = { Name: 'Capellan Confideration' };

    component.stageZero = {
      currentAffiliation: affiliation,
      affiliationExperience: [selectedSubaffiliationExperience]
    } as never;
    component.stageOne = {
      currentAffiliation: affiliation,
      changeAffState: 'off',
      affiliationExperience: []
    } as never;
    component.stageTwo = {
      currentAffiliation: affiliation,
      changeAffState: 'off',
      affiliationExperience: []
    } as never;

    expect(component.affiliationExperience).toEqual([selectedSubaffiliationExperience]);
  });

  it('aggregates signed experience and keeps skill subskills distinct', () => {
    component.stageZero = {
      experience: [
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 20 },
        { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: -5 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 10 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: -5 },
        { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Japanese', Quantity: 15 },
        { Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: -10 }
      ] as Experience[],
      currentAffiliation: undefined,
      affiliationExperience: []
    } as never;

    expect(component.Experience).toEqual(expect.arrayContaining([
      { Kind: Statistic.Attribute, Attribute: Attribute.Strength, Quantity: 15 },
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Russian', Quantity: 5 },
      { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: 'Japanese', Quantity: 15 },
      { Kind: Statistic.Trait, Trait: Trait.Fit, Quantity: -10 }
    ]));
    expect(component.TotalExp).toBe(25);
  });

  it('splits affiliation experience when stage 1 changes affiliation', () => {
    const stageZeroExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 20
    };
    const stageOneExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 30
    };
    component.stageZero = {
      currentAffiliation: { Name: 'Affiliation A' },
      affiliationExperience: [stageZeroExperience]
    } as never;
    component.stageOne = {
      currentAffiliation: { Name: 'Affiliation B' },
      changeAffState: 'on',
      affiliationExperience: [stageOneExperience]
    } as never;

    expect(component.affiliationExperience).toEqual([
      { ...stageZeroExperience, Quantity: 10 },
      { ...stageOneExperience, Quantity: 15 }
    ]);
  });

  it('splits affiliation experience when stage 2 changes affiliation', () => {
    const stageZeroExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Strength,
      Quantity: 20
    };
    const stageTwoExperience: Experience = {
      Kind: Statistic.Attribute,
      Attribute: Attribute.Body,
      Quantity: 30
    };
    component.stageZero = {
      currentAffiliation: { Name: 'Affiliation A' },
      affiliationExperience: [stageZeroExperience]
    } as never;
    component.stageOne = {
      currentAffiliation: { Name: 'Affiliation A' },
      changeAffState: 'off',
      affiliationExperience: []
    } as never;
    component.stageTwo = {
      currentAffiliation: { Name: 'Affiliation B' },
      changeAffState: 'on',
      affiliationExperience: [stageTwoExperience]
    } as never;

    expect(component.affiliationExperience).toEqual([
      { ...stageZeroExperience, Quantity: 10 },
      { ...stageTwoExperience, Quantity: 15 }
    ]);
  });

  it('adds real-life stages newest-first and removes only the latest', () => {
    const affiliation = { Name: 'Affiliation A' };
    const stageTwo = {
      affYearChanged: of(3000 as Eternal),
      currentAffiliation: affiliation
    };
    const stageThree = {
      affYearChanged: of(3010 as Eternal),
      currentAffiliation: affiliation
    };
    const stageFour = {
      affYearChanged: of(3020 as Eternal),
      currentAffiliation: affiliation
    };
    component.stageTwo = stageTwo as never;

    component.addRealLife(new Event('click'), 3);
    component.stageThree = { last: stageThree } as never;
    component.addRealLife(new Event('click'), 4);
    component.stageFour = { last: stageFour } as never;

    expect(component.RealLife.map(stage => stage.stage)).toEqual([4, 3]);
    expect(component.LatestStage3Or4).toBe(stageFour);

    component.removeRealLife(new Event('click'));

    expect(component.RealLife.map(stage => stage.stage)).toEqual([3]);
    expect(component.LatestStage3Or4).toBe(stageThree);
  });

  it('forwards the stage 0 language selection', () => {
    const language = {
      Kind: Statistic.Skill,
      Skill: Skill.Language,
      Subskill: 'Russian',
      Quantity: 20
    } as Experience & { Kind: Statistic.Skill, Skill: Skill.Language, Subskill: string };
    let currentLanguage: typeof language | undefined;
    component.CurrentLanguage.subscribe(value => currentLanguage = value);

    component.stageZero.languageChanged.emit(language);

    expect(currentLanguage).toEqual(language);
  });

  it('toggles itemized experience visibility', () => {
    const checkbox = fixture.nativeElement.querySelector('#showExp') as HTMLInputElement;

    expect(fixture.nativeElement.querySelectorAll('.itemized').length).toBeGreaterThan(0);
    checkbox.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.itemized').length).toBe(0);

    checkbox.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.itemized').length).toBeGreaterThan(0);
  });
});
